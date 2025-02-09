import axios from 'axios';
import { parse } from 'rss-to-json';
import { LoggingService } from '@/lib/LoggingService';
import AIServiceManager, { AIInteractionType } from '@/lib/AIServiceManager';

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
}

export class RSSService {
  private static instance: RSSService;
  private loggingService: LoggingService;
  private aiServiceManager: AIServiceManager;
  private sources = [
    'https://www.cnc.fr/rss/professionnels/aides-et-appels-a-projets',
    'https://www.arte.tv/rss/appels-a-projets',
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

  async fetchOpportunities(): Promise<RSSOpportunity[]> {
    const opportunities: RSSOpportunity[] = [];

    for (const source of this.sources) {
      try {
        const rssData = await parse(source);
        
        const sourceOpportunities = await Promise.all(
          rssData.items.map(async (item) => {
            // Utilisation de l'IA pour analyser et scorer la pertinence
            const aiAnalysis = await this.analyzeOpportunity(item);
            
            return {
              id: item.id || crypto.randomUUID(),
              title: item.title,
              description: item.description,
              link: item.link,
              source: source,
              publishedAt: item.published,
              ...aiAnalysis
            };
          })
        );

        opportunities.push(...sourceOpportunities);
      } catch (error) {
        this.loggingService.error('RSS Fetch Error', { 
          source, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return opportunities;
  }

  private async analyzeOpportunity(item: any): Promise<Partial<RSSOpportunity>> {
    try {
      const response = await this.aiServiceManager.generateContent({
        type: AIInteractionType.RSS_ANALYSIS,
        messages: [
          { 
            role: 'user', 
            content: `Analyze the following opportunity and provide a relevance score for an audiovisual project:\n\nTitle: ${item.title}\n\nDescription: ${item.description}` 
          }
        ],
        model: 'HAIKU',  // Utilisation du modèle léger pour l'analyse
        maxTokens: 200
      });

      // Parse la réponse AI pour extraire le score de pertinence et autres détails
      const analysis = JSON.parse(response.content);

      return {
        relevanceScore: analysis.relevanceScore || 0,
        category: analysis.category,
        deadline: analysis.deadline
      };
    } catch (error) {
      this.loggingService.error('AI Opportunity Analysis Error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      return {
        relevanceScore: 0
      };
    }
  }

  // Méthode pour filtrer et trier les opportunités
  async getRelevantOpportunities(minRelevanceScore: number = 0.5): Promise<RSSOpportunity[]> {
    const opportunities = await this.fetchOpportunities();
    return opportunities
      .filter(opp => (opp.relevanceScore || 0) >= minRelevanceScore)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }
}

export default RSSService;