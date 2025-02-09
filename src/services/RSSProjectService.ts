import { Project } from '@/components/EnhancedProjectList';
import AIServiceManager from '@/lib/AIServiceManager';

// Types enrichis
type RSSSource = {
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

export class RSSProjectService {
  private sources: RSSSource[];
  private aiManager: AIServiceManager;

  constructor() {
    this.sources = [
      { id: 1, url: 'https://cnc.fr/feed', type: 'rss', status: 'active', lastCheck: new Date() },
      { id: 2, url: 'https://www.francemarches.com/appels-offres-audiovisuel', type: 'scraping', status: 'active', lastCheck: new Date() },
      { id: 3, url: 'https://www.e-marchespublics.com', type: 'api', status: 'pending', lastCheck: null },
      { id: 4, url: 'https://appelaprojets.org', type: 'scraping', status: 'active', lastCheck: new Date() },
      { id: 5, url: 'https://www.marchesonline.com', type: 'api', status: 'active', lastCheck: new Date() },
      { id: 6, url: 'https://www.fimeco-walter-allinial.com', type: 'scraping', status: 'pending', lastCheck: null },
      { id: 7, url: 'https://www.cap-metiers.pro', type: 'rss', status: 'active', lastCheck: new Date() },
      { id: 8, url: 'https://ellesfontlaculture.culture.gouv.fr', type: 'scraping', status: 'active', lastCheck: new Date() }
    ];
    this.aiManager = AIServiceManager.getInstance();
  }

  // Méthodes utilitaires rajoutées
  private extractProjectTitle(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '').split('.')[0].replace(/[-_]/g, ' ');
    } catch {
      return 'Projet sans titre';
    }
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
      return 'Organisation inconnue';
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
    switch(source.type) {
      case 'rss': return 'high';
      case 'api': return 'medium';
      case 'scraping': return 'low';
      default: return 'low';
    }
  }

  private determinePriorityFromAnalysis(analysis: RSSSource['analysis']): Project['priority'] {
    if (!analysis) return 'low';
    if (analysis.score >= 80) return 'high';
    if (analysis.score >= 50) return 'medium';
    return 'low';
  }

  // Reste du code inchangé...
  convertToProjects(): Project[] {
    return this.sources.map(source => ({
      id: source.id.toString(),
      title: this.extractProjectTitle(source.url),
      organization: this.extractOrganization(source.url),
      status: this.determineProjectStatus(source),
      updatedAt: source.lastCheck?.toISOString() || new Date().toISOString(),
      progress: this.calculateProgress(source),
      priority: source.analysis ? this.determinePriorityFromAnalysis(source.analysis) : this.determinePriority(source),
      budget: 0, // À compléter si possible
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours par défaut
    }));
  }

  // Les autres méthodes restent inchangées...
}

export const rssProjectService = new RSSProjectService();