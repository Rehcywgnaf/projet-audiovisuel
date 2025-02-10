import { Project } from '@/components/EnhancedProjectList';
import AIServiceManager from '@/lib/AIServiceManager';
import { LoggingService } from '@/lib/LoggingService';
import { veilleService, Opportunity } from './VeilleService';
import { sourceDiscoveryService, DiscoveredSource } from './SourceDiscoveryService';

export type RSSSource = {
  id: number;
  url: string;
  type: 'rss' | 'scraping' | 'api';
  status: 'active' | 'pending' | 'error';
  lastCheck: Date | null;
  analysis?: {
    score: number;
    category: string;
    keywords: string[];
    lastAnalysis: Date;
  };
};

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
  categorizedProjects: { [key: string]: number };
}

export class RSSProjectService {
  private sources: RSSSource[];
  private aiManager: AIServiceManager;
  private loggingService: LoggingService;

  constructor() {
    this.loggingService = LoggingService.getInstance();
    this.aiManager = AIServiceManager.getInstance();
    this.sources = this.initializeSources();
  }

  private initializeSources(): RSSSource[] {
    return [
      { 
        id: 1, 
        url: 'https://cnc.fr/feed', 
        type: 'rss', 
        status: 'active', 
        lastCheck: new Date(),
        analysis: {
          score: 85,
          category: 'Audiovisuel',
          keywords: ['financement', 'cinéma', 'production'],
          lastAnalysis: new Date()
        }
      },
      { 
        id: 2, 
        url: 'https://www.francemarches.com/appels-offres-audiovisuel', 
        type: 'scraping', 
        status: 'active', 
        lastCheck: new Date(),
        analysis: {
          score: 75,
          category: 'Appels d\'offres',
          keywords: ['marché', 'public', 'audiovisuel'],
          lastAnalysis: new Date()
        }
      }
    ];
  }

  // Nouvelle méthode pour récupérer les sources
  public getSources(): RSSSource[] {
    return [...this.sources];
  }

  convertToProjects(): Project[] {
    const projects = this.sources.map(source => {
      const project = {
        id: source.id.toString(),
        title: this.extractProjectTitle(source.url),
        organization: this.extractOrganization(source.url),
        status: this.determineProjectStatus(source),
        updatedAt: source.lastCheck?.toISOString() || new Date().toISOString(),
        progress: this.calculateProgress(source),
        priority: this.determinePriority(source),
        category: source.analysis?.category,
        budget: '0', // À améliorer avec des données réelles
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Log détaillé de chaque projet converti
      console.log('Projet converti:', project);

      return project;
    });

    // Log du nombre total de projets convertis
    console.log(`Total de projets convertis : ${projects.length}`);

    return projects;
  }

  // Méthode de statistiques des projets
  public getProjectStats(): ProjectStats {
    const categorizedProjects = this.sources.reduce((acc, source) => {
      const category = source.analysis?.category || 'Non catégorisé';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalProjects: this.sources.length,
      activeProjects: this.sources.filter(source => source.status === 'active').length,
      completedProjects: this.sources.filter(source => source.status === 'error').length,
      pendingProjects: this.sources.filter(source => source.status === 'pending').length,
      categorizedProjects
    };
  }

  // ... Reste des méthodes privées inchangées
  private extractProjectTitle(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '').split('.')[0]
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch {
      return 'Projet sans titre';
    }
  }

  private extractOrganization(url: string): string {
    return this.extractProjectTitle(url);
  }

  private determineProjectStatus(source: RSSSource): Project['status'] {
    switch(source.status) {
      case 'active': return 'active';
      case 'pending': return 'pending';
      case 'error': return 'terminated';
      default: return 'pending';
    }
  }

  private calculateProgress(source: RSSSource): number {
    if (source.analysis && source.analysis.score) {
      return Math.min(source.analysis.score, 100);
    }
    return 10; // Valeur par défaut
  }

  private determinePriority(source: RSSSource): Project['priority'] {
    if (source.analysis) {
      if (source.analysis.score >= 80) return 'high';
      if (source.analysis.score >= 50) return 'medium';
    }
    return 'low';
  }
}

export const rssProjectService = new RSSProjectService();