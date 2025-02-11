import AIServiceManager from '@/lib/AIServiceManager';
import { rssProjectService } from './RSSProjectService';
import { apiService } from './apiService';
import { LoggingService } from '@/lib/LoggingService';
import { Project } from '@/components/EnhancedProjectList';

export interface Opportunity {
  id: number;
  type: 'AAP' | 'AO';
  title: string;
  budget: string;
  deadline: string;
  match: number;
  description?: string;
  source?: string;
  category?: string;
  requirements?: string[];
}

export interface FilterCriteria {
  type?: 'AAP' | 'AO';
  minBudget?: number;
  maxBudget?: number;
  minMatch?: number;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export class VeilleService {
  private aiManager: AIServiceManager;
  private loggingService: LoggingService;

  constructor() {
    this.aiManager = AIServiceManager.getInstance();
    this.loggingService = LoggingService.getInstance();
  }

  async fetchOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      const apiOpportunities = await this.fetchAPIOpportunities(filters);
      const projects = await rssProjectService.convertToProjects();

      const opportunitiesFromProjects: Opportunity[] = projects.map(project => ({
        id: Number(project.id),
        type: this.determineOpportunityType(project.title),
        title: project.title,
        budget: project.budget,
        deadline: project.deadline,
        match: this.calculateMatchFromProject(project),
        description: project.title, // Utiliser le titre comme description par défaut
        source: project.organization,
        category: project.category
      }));

      const allOpportunities = [
        ...apiOpportunities,
        ...opportunitiesFromProjects
      ];

      console.log('Opportunités:', allOpportunities.length);
      allOpportunities.forEach((opp, index) => {
        console.log(`Opportunité ${index + 1}:`, {
          title: opp.title,
          type: opp.type,
          budget: opp.budget,
          deadline: opp.deadline,
          source: opp.source
        });
      });

      return await this.enrichOpportunitiesWithAI(allOpportunities);
    } catch (error) {
      this.loggingService.error('Erreur VeilleService', { 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      return [];
    }
  }

  // Nouvelle méthode ajoutée
  async getOpportunities(filtres?: FilterCriteria): Promise<Opportunity[]> {
    return this.fetchOpportunities(filtres);
  }

  private async fetchAPIOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      const apiEndpoints = [
        'https://www.marchesonline.com/api/opportunities',
        'https://www.e-marchespublics.com/api/calls'
      ];

      const opportunitiesPromises = apiEndpoints.map(async (endpoint) => {
        const apiData = await apiService.fetchOpportunities(endpoint, filters);
        return apiData.map(item => ({
          id: item.id,
          type: item.type,
          title: item.title,
          budget: item.budget,
          deadline: item.deadline,
          match: 0,
          description: item.description,
          source: endpoint
        }));
      });

      return (await Promise.all(opportunitiesPromises)).flat();
    } catch (error) {
      this.loggingService.error('Erreur de récupération API', { error });
      return [];
    }
  }

  private async enrichOpportunitiesWithAI(opportunities: Opportunity[]): Promise<Opportunity[]> {
    try {
      const enrichedOpportunities = await Promise.all(
        opportunities.map(async (opportunity) => {
          const enrichmentResponse = await this.aiManager.processRequest('veille-analyzer', 'enrich', {
            data: opportunity,
            options: {
              cache: true,
              complexity: 'simple',
              monitoringKey: 'opportunity_enrichment'
            }
          });

          if (enrichmentResponse.success) {
            return {
              ...opportunity,
              match: enrichmentResponse.data.match || this.matchScore(opportunity),
              category: enrichmentResponse.data.category || opportunity.category,
              requirements: enrichmentResponse.data.requirements
            };
          }

          return opportunity;
        })
      );

      return this.filterAndSortOpportunities(enrichedOpportunities);
    } catch (error) {
      this.loggingService.error('Erreur d\'enrichissement IA', { error });
      return opportunities;
    }
  }

  private determineOpportunityType(title: string): 'AAP' | 'AO' {
    const aapKeywords = ['appel à projet', 'appel à candidature'];
    const aoKeywords = ['appel d\'offre', 'marché public'];

    const lowercaseTitle = title.toLowerCase();
    return aapKeywords.some(keyword => lowercaseTitle.includes(keyword)) ? 'AAP' : 'AO';
  }

  private calculateMatchFromProject(project: Project): number {
    switch(project.priority) {
      case 'high': return 80;
      case 'medium': return 50;
      default: return 20;
    }
  }

  private matchScore(opportunity: Opportunity): number {
    let score = 0;
    
    if (opportunity.budget !== 'Non spécifié') score += 30;
    if (opportunity.deadline !== 'Non spécifié') score += 20;
    if (opportunity.description) score += 30;
    
    return Math.min(score, 100);
  }

  private filterAndSortOpportunities(opportunities: Opportunity[]): Opportunity[] {
    return opportunities
      .filter(opp => opp.match > 0)
      .sort((a, b) => b.match - a.match);
  }
}

export const veilleService = new VeilleService();