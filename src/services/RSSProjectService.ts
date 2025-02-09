import { Project } from '@/components/EnhancedProjectList';
import AIServiceManager from '@/lib/AIServiceManager';
import { LoggingService } from '@/lib/LoggingService';
import { veilleService } from './VeilleService';

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
      // Sources supplémentaires peuvent être ajoutées
    ];
  }

  async updateSourceAnalysis(sourceId: number): Promise<boolean> {
    try {
      const source = this.sources.find(s => s.id === sourceId);
      if (!source) return false;

      // Utilisation de AIServiceManager pour l'analyse
      const analysisResult = await this.aiManager.processRequest('source-analyzer', 'analyze', {
        data: { 
          url: source.url, 
          type: source.type 
        },
        options: {
          cache: true,
          monitoringKey: 'rss_source_analysis'
        }
      });

      if (analysisResult.success) {
        source.analysis = {
          score: analysisResult.data.score || 0,
          category: analysisResult.data.category || 'Non catégorisé',
          keywords: analysisResult.data.keywords || [],
          lastAnalysis: new Date()
        };
        source.status = 'active';
        return true;
      }

      source.status = 'error';
      return false;
    } catch (error) {
      this.loggingService.error('Erreur de mise à jour de l\'analyse source', { 
        sourceId, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      return false;
    }
  }

  getProjectStats(): ProjectStats {
    const projects = this.convertToProjects();
    const categorizedProjects = projects.reduce((acc, project) => {
      const category = project.category || 'Non catégorisé';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'terminated').length,
      pendingProjects: projects.filter(p => p.status === 'pending').length,
      categorizedProjects
    };
  }

  convertToProjects(): Project[] {
    return this.sources.map(source => ({
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
    }));
  }

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

  getSources(): RSSSource[] {
    return [...this.sources];
  }

  async addSource(url: string): Promise<boolean> {
    // Vérification et ajout de source avec validation
    try {
      // Vérification de l'URL
      new URL(url);

      // Vérification que la source n'existe pas déjà
      if (this.sources.some(s => s.url === url)) {
        this.loggingService.warn('Source déjà existante', { url });
        return false;
      }

      // Tentative de récupération des données pour validation
      const opportunities = await veilleService.fetchOpportunities({ dateRange: { 
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
        end: new Date() 
      }});

      if (opportunities.length > 0) {
        const newSource: RSSSource = {
          id: this.sources.length + 1,
          url,
          type: this.determineSourceType(url),
          status: 'active',
          lastCheck: new Date(),
          analysis: {
            score: 50, // Score initial par défaut
            category: 'Non catégorisé',
            keywords: [],
            lastAnalysis: new Date()
          }
        };

        this.sources.push(newSource);
        return true;
      }

      return false;
    } catch (error) {
      this.loggingService.error('Erreur d\'ajout de source', { 
        url, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      return false;
    }
  }

  private determineSourceType(url: string): RSSSource['type'] {
    if (url.includes('rss') || url.includes('feed')) return 'rss';
    if (url.includes('api')) return 'api';
    return 'scraping';
  }
}

export const rssProjectService = new RSSProjectService();