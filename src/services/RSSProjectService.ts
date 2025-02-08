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

  // Méthode pour ajouter une nouvelle source
  async addSource(url: string): Promise<RSSSource> {
    try {
      // Analyse via IA
      const analysisResponse = await this.aiManager.processRequest('rss-analyzer', 'analyze', {
        data: { url },
        options: {
          priority: 'high',
          cache: true
        }
      });

      const newSource: RSSSource = {
        id: Date.now(),
        url,
        type: this.determineSourceType(url),
        status: 'pending',
        lastCheck: null,
        analysis: analysisResponse.success ? {
          score: analysisResponse.data.score || 0,
          category: analysisResponse.data.category || 'unknown',
          keywords: analysisResponse.data.keywords || [],
          lastAnalysis: new Date()
        } : undefined
      };

      this.sources.push(newSource);
      return newSource;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la source:', error);
      throw error;
    }
  }

  // Méthode pour supprimer une source
  removeSource(id: number): void {
    this.sources = this.sources.filter(source => source.id !== id);
  }

  // Méthode pour récupérer toutes les sources
  getSources(): RSSSource[] {
    return this.sources;
  }

  // Méthode pour mettre à jour l'analyse d'une source
  async updateAnalysis(id: number): Promise<void> {
    const source = this.sources.find(s => s.id === id);
    if (!source) return;

    try {
      const analysisResponse = await this.aiManager.processRequest('rss-analyzer', 'analyze', {
        data: { url: source.url },
        options: {
          priority: 'medium',
          cache: true
        }
      });

      if (analysisResponse.success) {
        source.analysis = {
          score: analysisResponse.data.score || 0,
          category: analysisResponse.data.category || 'unknown',
          keywords: analysisResponse.data.keywords || [],
          lastAnalysis: new Date()
        };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'analyse:', error);
      throw error;
    }
  }

  private determineSourceType(url: string): RSSSource['type'] {
    if (url.includes('feed') || url.includes('rss')) return 'rss';
    if (url.includes('api')) return 'api';
    return 'scraping';
  }

  // Méthodes existantes...
  convertToProjects(): Project[] {
    return this.sources.map(source => ({
      id: source.id.toString(),
      title: this.extractProjectTitle(source.url),
      organization: this.extractOrganization(source.url),
      status: this.determineProjectStatus(source),
      updatedAt: source.lastCheck?.toISOString() || new Date().toISOString(),
      progress: this.calculateProgress(source),
      priority: source.analysis ? this.determinePriorityFromAnalysis(source.analysis) : this.determinePriority(source)
    }));
  }

  private determinePriorityFromAnalysis(analysis: RSSSource['analysis']): Project['priority'] {
    if (!analysis) return 'low';
    if (analysis.score >= 80) return 'high';
    if (analysis.score >= 50) return 'medium';
    return 'low';
  }

  // [Autres méthodes utilitaires restent inchangées...]

  getProjectStats() {
    const projects = this.convertToProjects();
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length
    };
  }
}

export const rssProjectService = new RSSProjectService();