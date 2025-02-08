import { createContext, useContext } from 'react';
import AIServiceManager from '@/lib/AIServiceManager';
import { scrapingService } from './scrapingService';
import { apiService } from './apiService';

// Types pour les opportunités
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

interface VeilleContextType {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: Error | null;
  refreshOpportunities: () => Promise<void>;
  filterOpportunities: (criteria: FilterCriteria) => Promise<void>;
}

// Types pour les filtres
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

// Service de veille amélioré
export class VeilleService {
  private aiManager: AIServiceManager;

  constructor() {
    this.aiManager = AIServiceManager.getInstance();
  }

  async fetchOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      // Collecte des sources RSS
      const rssOpportunities = await this.fetchRSSOpportunities(filters);
      
      // Collecte des sources API
      const apiOpportunities = await this.fetchAPIOpportunities(filters);
      
      // Collecte des sources Scraping
      const scrapingOpportunities = await this.fetchScrapingOpportunities(filters);

      // Combinaison et enrichissement des opportunités
      const allOpportunities = [
        ...rssOpportunities, 
        ...apiOpportunities, 
        ...scrapingOpportunities
      ];

      // Enrichissement IA
      return await this.enrichOpportunitiesWithAI(allOpportunities);
    } catch (error) {
      console.error('Erreur VeilleService:', error);
      throw error;
    }
  }

  private async fetchRSSOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      // Utilisation du service de parsing RSS
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
      console.error('Erreur de récupération RSS:', error);
      return [];
    }
  }

  private async fetchAPIOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      // Utilisation du service API
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
      console.error('Erreur de récupération API:', error);
      return [];
    }
  }

  private async fetchScrapingOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      // Utilisation du service de scraping
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
          budget: this.extractBudget(item.description),
          deadline: this.extractDeadline(item.description),
          match: 0,
          description: item.description,
          source: source
        }));
      });

      return (await Promise.all(opportunitiesPromises)).flat();
    } catch (error) {
      console.error('Erreur de scraping:', error);
      return [];
    }
  }

  private async enrichOpportunitiesWithAI(opportunities: Opportunity[]): Promise<Opportunity[]> {
    try {
      const enrichedOpportunities = await Promise.all(
        opportunities.map(async (opportunity) => {
          const enrichmentResponse = await this.aiManager.processRequest('rss-analyzer', 'enrich', {
            data: opportunity,
            options: {
              cache: true,
              complexity: 'simple'
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
      console.error('Erreur d\'enrichissement IA:', error);
      return opportunities;
    }
  }

  private filterAndSortOpportunities(opportunities: Opportunity[]): Opportunity[] {
    return opportunities
      .filter(opp => opp.match > 0)
      .sort((a, b) => b.match - a.match);
  }

  private determineOpportunityType(title: string): 'AAP' | 'AO' {
    const aapKeywords = ['appel à projet', 'appel à candidature'];
    const aoKeywords = ['appel d\'offre', 'marché public'];

    const lowercaseTitle = title.toLowerCase();
    if (aapKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return 'AAP';
    }
    return 'AO';
  }

  private extractBudget(description?: string): string {
    if (!description) return 'Non spécifié';
    const budgetMatch = description.match(/(\d+(?:\s*\d{3})*)\s*(?:€|euros)/i);
    return budgetMatch ? `${budgetMatch[1]} €` : 'Non spécifié';
  }

  private extractDeadline(description?: string): string {
    if (!description) return 'Non spécifié';
    const dateMatch = description.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    return dateMatch ? dateMatch[1] : 'Non spécifié';
  }

  matchScore(opportunity: Opportunity): number {
    let score = 0;
    
    if (opportunity.budget !== 'Non spécifié') score += 30;
    if (opportunity.deadline !== 'Non spécifié') score += 20;
    if (opportunity.description) score += 30;
    
    return Math.min(score, 100);
  }
}

// Context pour la veille
export const VeilleContext = createContext<VeilleContextType | undefined>(undefined);

export function useVeille() {
  const context = useContext(VeilleContext);
  if (context === undefined) {
    throw new Error('useVeille doit être utilisé dans un VeilleProvider');
  }
  return context;
}

export const veilleService = new VeilleService();