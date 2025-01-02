import { 
  AO, 
  AOSearchFilters, 
  AOPaginatedResponse, 
  AOStatus,
  AODocument 
} from './types';
import { v4 as uuidv4 } from 'uuid';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

export class AOService {
  private aos: Map<string, AO>;

  constructor() {
    this.aos = new Map();
  }

  async createFromRSS(rssItem: RSSItem): Promise<AO> {
    const ao: AO = {
      id: uuidv4(),
      title: rssItem.title,
      reference: `AO-${Date.now()}`,
      source: 'RSS',
      status: 'NEW',
      publishedAt: new Date(rssItem.pubDate),
      submissionDeadline: this.extractDeadlineFromDescription(rssItem.description),
      description: rssItem.description,
      client: {
        name: this.extractClientFromDescription(rssItem.description),
        type: this.detectClientType(rssItem.description),
      },
      documents: [],
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'SYSTEM',
      tags: this.extractTagsFromDescription(rssItem.description),
    };

    await this.save(ao);
    return ao;
  }

  async create(aoData: Partial<AO>): Promise<AO> {
    const ao: AO = {
      id: uuidv4(),
      title: aoData.title || '',
      reference: aoData.reference || `AO-${Date.now()}`,
      source: 'MANUAL',
      status: 'NEW',
      publishedAt: aoData.publishedAt || new Date(),
      submissionDeadline: aoData.submissionDeadline || new Date(),
      description: aoData.description || '',
      client: aoData.client || {
        name: '',
        type: 'PUBLIC'
      },
      documents: [],
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: aoData.createdBy || 'SYSTEM',
      tags: aoData.tags || [],
    };

    await this.save(ao);
    return ao;
  }

  async update(id: string, updates: Partial<AO>): Promise<AO> {
    const ao = await this.getById(id);
    if (!ao) throw new Error(`AO with id ${id} not found`);

    const updatedAO = {
      ...ao,
      ...updates,
      updatedAt: new Date()
    };

    await this.save(updatedAO);
    return updatedAO;
  }

  async getById(id: string): Promise<AO | null> {
    return this.aos.get(id) || null;
  }

  async search(filters: AOSearchFilters, page = 1, pageSize = 10): Promise<AOPaginatedResponse> {
    let filtered = Array.from(this.aos.values());

    if (filters.status) {
      filtered = filtered.filter(ao => filters.status?.includes(ao.status));
    }
    if (filters.client) {
      filtered = filtered.filter(ao => ao.client.name.toLowerCase().includes(filters.client!.toLowerCase()));
    }
    if (filters.dateRange) {
      filtered = filtered.filter(ao => {
        const date = ao.publishedAt;
        return date >= filters.dateRange!.start && date <= filters.dateRange!.end;
      });
    }
    if (filters.assignedTo) {
      filtered = filtered.filter(ao => ao.assignedTo === filters.assignedTo);
    }
    if (filters.tags) {
      filtered = filtered.filter(ao => 
        filters.tags?.some(tag => ao.tags.includes(tag))
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total,
      page,
      pageSize
    };
  }

  async addDocument(aoId: string, document: Omit<AODocument, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<AO> {
    const ao = await this.getById(aoId);
    if (!ao) throw new Error(`AO with id ${aoId} not found`);

    const newDocument: AODocument = {
      id: uuidv4(),
      ...document,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    ao.documents.push(newDocument);
    ao.updatedAt = new Date();

    await this.save(ao);
    return ao;
  }

  private extractDeadlineFromDescription(description: string): Date {
    const datePatterns = [
      /date limite.*?(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i,
      /deadline.*?(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i,
      /soumission.*?(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i,
      /avant le.*?(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i
    ];

    for (const pattern of datePatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        const [day, month, year] = match[1].split(/[\/\-]/).map(Number);
        return new Date(year, month - 1, day);
      }
    }

    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  private extractClientFromDescription(description: string): string {
    const clientPatterns = [
      /pour le compte de (.*?)[\n\.]/, 
      /client : (.*?)[\n\.]/, 
      /commanditaire : (.*?)[\n\.]/,
      /demandeur : (.*?)[\n\.]/
    ];

    for (const pattern of clientPatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    const firstLine = description.split('\n')[0];
    return firstLine.slice(0, 100).trim();
  }

  private detectClientType(description: string): 'PUBLIC' | 'PRIVATE' {
    const publicKeywords = [
      'ministère',
      'mairie',
      'collectivité',
      'public',
      'état',
      'région',
      'département',
      'communauté de communes',
      'administration',
      'établissement public'
    ];

    const descriptionLower = description.toLowerCase();
    return publicKeywords.some(keyword => descriptionLower.includes(keyword)) 
      ? 'PUBLIC' 
      : 'PRIVATE';
  }

  private extractTagsFromDescription(description: string): string[] {
    const tags = new Set<string>();
    
    const keywordCategories = {
      type: ['documentaire', 'fiction', 'série', 'court-métrage', 'long-métrage', 'animation'],
      technique: ['tournage', 'montage', 'post-production', '4K', 'HD', 'son', 'mixage'],
      budget: ['petit budget', 'moyen budget', 'gros budget'],
      urgence: ['urgent', 'prioritaire', 'express'],
      complexité: ['complexe', 'simple', 'standard']
    };

    const descriptionLower = description.toLowerCase();

    Object.entries(keywordCategories).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (descriptionLower.includes(keyword)) {
          tags.add(keyword);
        }
      });
    });

    const budgetMatch = description.match(/(\d+)\s*(?:k€|ke|k euros|€|euros)/i);
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1]);
      if (amount < 50) tags.add('petit-budget');
      else if (amount < 200) tags.add('budget-moyen');
      else tags.add('gros-budget');
    }

    const deadline = this.extractDeadlineFromDescription(description);
    const daysUntilDeadline = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDeadline <= 7) tags.add('très-urgent');
    else if (daysUntilDeadline <= 14) tags.add('urgent');

    return Array.from(tags);
  }

  private async save(ao: AO): Promise<void> {
    this.aos.set(ao.id, ao);
    // TODO: Implémenter la persistance (DB, fichier, etc.)
  }
}

export const aoService = new AOService();