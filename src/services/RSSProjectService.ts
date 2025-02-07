import { Project } from '@/components/EnhancedProjectList';

// Type représentant une source RSS
type RSSSource = {
  id: number;
  url: string;
  type: 'rss' | 'scraping' | 'api';
  status: 'active' | 'pending';
  lastCheck: Date | null;
};

export class RSSProjectService {
  private sources: RSSSource[] = [
    { id: 1, url: 'https://cnc.fr/feed', type: 'rss', status: 'active', lastCheck: new Date() },
    { id: 2, url: 'https://www.francemarches.com/appels-offres-audiovisuel', type: 'scraping', status: 'active', lastCheck: new Date() },
    { id: 3, url: 'https://www.e-marchespublics.com', type: 'api', status: 'pending', lastCheck: null },
    { id: 4, url: 'https://appelaprojets.org', type: 'scraping', status: 'active', lastCheck: new Date() },
    { id: 5, url: 'https://www.marchesonline.com', type: 'api', status: 'active', lastCheck: new Date() },
    { id: 6, url: 'https://www.fimeco-walter-allinial.com', type: 'scraping', status: 'pending', lastCheck: null },
    { id: 7, url: 'https://www.cap-metiers.pro', type: 'rss', status: 'active', lastCheck: new Date() },
    { id: 8, url: 'https://ellesfontlaculture.culture.gouv.fr', type: 'scraping', status: 'active', lastCheck: new Date() }
  ];

  // Convertit les sources RSS en projets
  convertToProjects(): Project[] {
    return this.sources.map(source => ({
      id: source.id.toString(),
      title: this.extractProjectTitle(source.url),
      organization: this.extractOrganization(source.url),
      status: this.determineProjectStatus(source),
      updatedAt: source.lastCheck?.toISOString() || new Date().toISOString(),
      progress: this.calculateProgress(source),
      priority: this.determinePriority(source)
    }));
  }

  // Méthodes utilitaires pour extraire/générer des informations
  private extractProjectTitle(url: string): string {
    const titles: { [key: string]: string } = {
      'cnc.fr': 'Appel CNC',
      'francemarches.com': 'Marché Audiovisuel',
      'appelaprojets.org': 'Projet Culturel',
      'marchesonline.com': 'Marché Public',
      'cap-metiers.pro': 'Formation Audiovisuelle',
      'ellesfontlaculture.culture.gouv.fr': 'Projet Culturel Gouvernemental'
    };

    for (const [key, title] of Object.entries(titles)) {
      if (url.includes(key)) return title;
    }
    return 'Projet Audiovisuel';
  }

  private extractOrganization(url: string): string {
    const organizations: { [key: string]: string } = {
      'cnc.fr': 'Centre National du Cinéma',
      'francemarches.com': 'Marchés Publics',
      'appelaprojets.org': 'Associations Culturelles',
      'marchesonline.com': 'Plateformes de Marchés',
      'cap-metiers.pro': 'Réseau Cap Métiers',
      'ellesfontlaculture.culture.gouv.fr': 'Ministère de la Culture'
    };

    for (const [key, org] of Object.entries(organizations)) {
      if (url.includes(key)) return org;
    }
    return 'Organisme Audiovisuel';
  }

  private determineProjectStatus(source: RSSSource): Project['status'] {
    switch(source.status) {
      case 'active': return 'active';
      case 'pending': return 'pending';
      default: return 'completed';
    }
  }

  private calculateProgress(source: RSSSource): number {
    if (source.status === 'active') return 60;
    if (source.status === 'pending') return 20;
    return 100;
  }

  private determinePriority(source: RSSSource): Project['priority'] {
    if (source.type === 'api') return 'high';
    if (source.type === 'rss') return 'medium';
    return 'low';
  }

  // Méthode pour récupérer les statistiques globales
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