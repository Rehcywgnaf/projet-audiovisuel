import axios from 'axios';
import { parse } from 'rss-to-json';
import { LoggingService } from '@/lib/LoggingService';
import AIServiceManager, { AIInteractionType } from '@/lib/AIServiceManager';
import { validateURL, sanitizeText, extractDate, extractBudget } from '../utils/dataValidation';

export interface RSSOpportunity {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: string;
  deadline?: string;
  category?: string;
  relevanceScore?: number;
  budget?: string;
}

export class RSSService {
  private static instance: RSSService;
  private loggingService: LoggingService;
  private aiServiceManager: AIServiceManager;
  private sources = [
    'https://www.cnc.fr/rss/professionnels/aides-et-appels-a-projets',
    'https://www.arte.tv/rss/appels-a-projets',
    'https://www.culture.gouv.fr/rss/appels-projets',
    // Ajouter d'autres sources RSS
  ];

  private constructor() {
    this.loggingService = LoggingService.getInstance();
    this.aiServiceManager = AIServiceManager.getInstance();
  }

  public static getInstance(): RSSService {
    if (!RSSService.instance) {
      RSSService.instance = new RSSService();
    }
    return RSSService.instance;
  }

  async addSource(newSource: string): Promise<boolean> {
    if (!validateURL(newSource)) {
      this.loggingService.warn('URL RSS invalide', { url: newSource });
      return false;
    }

    if (this.sources.includes(newSource)) {
      this.loggingService.warn('Source RSS déjà existante', { url: newSource });
      return false;
    }

    try {
      // Vérification rapide de la validité du flux
      await parse(newSource);
      this.sources.push(newSource);
      return true;
    } catch (error) {
      this.loggingService.error('Impossible de parser la source RSS', { 
        url: newSource, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      return false;
    }
  }

  async fetchOpportunities(): Promise<RSSOpportunity[]> {
    const opportunities: RSSOpportunity[] = [];

    for (const source of this.sources) {
      try {
        const rssData = await parse(source);
        
        const sourceOpportunities = await Promise.all(
          rssData.items.map(async (item) => {
            // Nettoyer et valider les données
            const cleanTitle = sanitizeText(item.title);
            const cleanDescription = sanitizeText(item.description);

            if (!cleanTitle || !cleanDescription) return null;

            // Analyse IA
            const aiAnalysis = await this.analyzeOpportunity({
              title: cleanTitle,
              description: cleanDescription
            });
            
            return {
              id: item.id || this.generateUniqueId(),
              title: cleanTitle,
              description: cleanDescription,
              link: item.link || '',
              source: source,
              publishedAt: item.published ? new Date(item.published).toISOString() : new Date().toISOString(),
              deadline: extractDate(cleanDescription),
              budget: extractBudget(cleanDescription),
              ...aiAnalysis
            };
          })
        );

        // Filtrer les entrées nulles et valides
        opportunities.push(...sourceOpportunities.filter(Boolean) as RSSOpportunity[]);
      } catch (error) {
        this.loggingService.error('Erreur de récupération RSS', { 
          source, 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        });
      }
    }

    return this.filterAndSortOpportunities(opportunities);
  }

  private generateUniqueId(): string {
    return `RSS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async analyzeOpportunity(item: { title: string, description: string }): Promise<Partial<RSSOpportunity>> {
    try {
      const response = await this.aiServiceManager.processRequest('rss-analyzer', 'analyze', {
        data: {
          title: item.title,
          description: item.description
        },
        options: {
          model: 'HAIKU', // Choix du modèle par AIServiceManager
          cache: true,    // Utilisation du cache centralisé
          complexity: 'simple',
          monitoringKey: 'rss_opportunity_analysis'
        }
      });

      // Si le traitement réussit
      if (response.success) {
        return {
          relevanceScore: response.data.relevanceScore || 0,
          category: response.data.category || 'Non catégorisé',
          // Autres métadonnées potentielles
        };
      } else {
        // Gestion des cas où l'IA ne peut pas traiter
        this.loggingService.warn('Analyse IA incomplète', { 
          reason: response.error 
        });

        return {
          relevanceScore: 0,
          category: 'Non catégorisé'
        };
      }
    } catch (error) {
      this.loggingService.error('Erreur d\'analyse IA', { 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      
      return {
        relevanceScore: 0,
        category: 'Non catégorisé'
      };
    }
  }

  private filterAndSortOpportunities(opportunities: RSSOpportunity[]): RSSOpportunity[] {
    return opportunities
      .filter(opp => (opp.relevanceScore || 0) > 0.3) // Seuil de pertinence
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)) // Tri par pertinence
      .slice(0, 100); // Limiter à 100 opportunités
  }

  // Méthode pour récupérer les sources actuelles
  getSources(): string[] {
    return [...this.sources];
  }

  // Méthode pour supprimer une source
  removeSource(sourceUrl: string): boolean {
    const initialLength = this.sources.length;
    this.sources = this.sources.filter(source => source !== sourceUrl);
    
    return this.sources.length < initialLength;
  }
}

export default RSSService;