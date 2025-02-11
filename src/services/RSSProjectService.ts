import { Project } from '@/components/EnhancedProjectList';
import AIServiceManager from '@/lib/AIServiceManager';
import { LoggingService } from '@/lib/LoggingService';
import { unifiedScrapingService } from './unifiedScrapingService';
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

  // Nouvelle méthode pour récupérer les sources avec leurs opportunités
  public async getSourcesWithOpportunities(): Promise<{ source: RSSSource, opportunities: any[] }[]> {
    const sourcesWithOpportunities = await Promise.all(
      this.sources.map(async (source) => {
        let opportunities: any[] = [];
        
        try {
          if (source.type === 'rss') {
            opportunities = await unifiedScrapingService.parseRSSFeed(source.url);
          } else if (source.type === 'scraping') {
            opportunities = await unifiedScrapingService.scrapeOpportunities(source.url);
          }
        } catch (error) {
          this.loggingService.error(`Erreur de récupération pour ${source.url}`, { error });
        }

        return { source, opportunities };
      })
    );

    return sourcesWithOpportunities;
  }

  // Méthode pour récupérer les sources
  public getSources(): RSSSource[] {
    return [...this.sources];
  }

  // Conversion des opportunités en projets
  async convertToProjects(): Promise<Project[]> {
    const sourcesWithOpportunities = await this.getSourcesWithOpportunities();
    
    const projects = sourcesWithOpportunities.flatMap(({ source, opportunities }) => 
      opportunities.map(opportunity => {
        const project: Project = {
          id: `${source.id}-${opportunity.title.slice(0, 10).replace(/\s+/g, '-')}`,
          title: opportunity.title,
          organization: this.extractOrganization(source.url),
          status: this.determineProjectStatus(source),
          updatedAt: new Date().toISOString(),
          progress: this.calculateProgress(source),
          priority: this.determinePriority(source),
          category: source.analysis?.category || 'Non catégorisé',
          budget: opportunity.budget || '0',
          deadline: opportunity.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        return project;
      })
    );

    // Log du nombre total de projets convertis
    console.log(`Total de projets convertis : ${projects.length}`);

    return projects;
  }

  // Méthode de statistiques des projets
  public async getProjectStats(): Promise<ProjectStats> {
    const projects = await this.convertToProjects();
    
    const categorizedProjects = projects.reduce((acc, project) => {
      const category = project.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(project => project.status === 'active').length,
      completedProjects: projects.filter(project => project.status === 'terminated').length,
      pendingProjects: projects.filter(project => project.status === 'pending').length,
      categorizedProjects
    };
  }

  private extractOrganization(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '').split('.')[0]
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch {
      return 'Organisation Inconnue';
    }
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