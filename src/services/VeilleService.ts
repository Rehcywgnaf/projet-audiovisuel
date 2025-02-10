import AIServiceManager from '@/lib/AIServiceManager';
import { scrapingService } from './scrapingService';
import { apiService } from './apiService';
import { rssProjectService } from './RSSProjectService';
import { LoggingService } from '@/lib/LoggingService';

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
      // Collecte des sources RSS, API et Scraping
      const rssOpportunities = await this.fetchRSSOpportunities(filters);
      const apiOpportunities = await this.fetchAPIOpportunities(filters);
      const scrapingOpportunities = await this.fetchScrapingOpportunities(filters);

      // Log du nombre d'opportunités trouvées
      console.log('Opportunités RSS:', rssOpportunities.length);
      console.log('Opportunités API:', apiOpportunities.length);
      console.log('Opportunités Scraping:', scrapingOpportunities.length);

      // Combinaison des opportunités
      const allOpportunities = [
        ...rssOpportunities, 
        ...apiOpportunities, 
        ...scrapingOpportunities
      ];

      // Logging des détails des opportunités
      allOpportunities.forEach((opp, index) => {
        console.log(`Opportunité ${index + 1}:`, {
          title: opp.title,
          type: opp.type,
          budget: opp.budget,
          deadline: opp.deadline,
          source: opp.source
        });
      });

      // Enrichissement IA via AIServiceManager
      return await this.enrichOpportunitiesWithAI(allOpportunities);
    } catch (error) {
      this.loggingService.error('Erreur VeilleService', { 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      return [];
    }
  }

  private async fetchRSSOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      const rssFeeds = [
        'https://cnc.fr/feed',
        'https://www.cap-metiers.pro/rss'
      ];

      const opportunitiesPromises = rssFeeds.map(async (feed) => {
        const feedData = await scrapingService.parseRSSFeed(feed);
        return feedData.map(item => ({
          id: Date.now() + Math.random(),
          type: this.determineOpportunityType(item.title),
          title: item.title,
          budget: this.extractBudget(item.description),
          deadline: this.extractDeadline(item.description),
          match: 0,
          description: item.description,
          source: feed
        }));
      });

      return (await Promise.all(opportunitiesPromises)).flat();
    } catch (error) {
      this.loggingService.error('Erreur de récupération RSS', { error });
      return [];
    }
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

  private async fetchScrapingOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      const scrapingSources = [
        'https://www.francemarches.com/appels-offres-audiovisuel',
        'https://ellesfontlaculture.culture.gouv.fr'
      ];

      const opportunitiesPromises = scrapingSources.map(async (source) => {
        const scrapedData = await scrapingService.scrapeOpportunities(source);
        return scrapedData.map(item => ({
          id: Date.now() + Math.random(),
          type: this.determineOpportunityType(item.title),
          title: item.title,
          budget: item.budget,
          deadline: item.deadline,
          match: 0,
          description: item.description,
          source: source
        }));
      });

      return (await Promise.all(opportunitiesPromises)).flat();
    } catch (error) {
      this.loggingService.error('Erreur de scraping', { error });
      return [];
    }
  }

  private async enrichOpportunitiesWithAI(opportunities: Opportunity[]): Promise<Opportunity[]> {
    try {
      // Utilisation de AIServiceManager pour l'enrichissement
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
              category: enrichmentResponse.data.category,
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

  private extractBudget(description?: string): string {
    if (!description) return 'Non spécifié';
    const budgetMatch = description.match(/(\d+(?:\s*\d{3})*)?\s*(?:€|euros)/i);
    return budgetMatch ? `${budgetMatch[1]} €` : 'Non spécifié';
  }

  private extractDeadline(description?: string): string {
    if (!description) return 'Non spécifié';
    const dateMatch = description.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    return dateMatch ? dateMatch[1] : 'Non spécifié';
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