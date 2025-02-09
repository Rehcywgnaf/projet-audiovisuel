import Anthropic from '@anthropic-ai/sdk';
import { CacheManager } from './CacheManager';
import { BudgetTracker } from './BudgetTracker';
import { LoggingService } from './LoggingService';

export enum AIRequestType {
  RSS_ANALYSIS = 'RSS_ANALYSIS',
  DOCUMENT_GENERATION = 'DOCUMENT_GENERATION',
  PROJECT_SUMMARY = 'PROJECT_SUMMARY',
  DEADLINE_ANALYSIS = 'DEADLINE_ANALYSIS'
}

export interface AIRequestParams {
  type: AIRequestType;
  messages: Array<{ role: string; content: string }>;
  model?: string;
  maxTokens?: number;
  additionalContext?: Record<string, any>;
}

class AIServiceManager {
  private static instance: AIServiceManager;
  private client: Anthropic;
  private cacheManager: CacheManager;
  private budgetTracker: BudgetTracker;
  private loggingService: LoggingService;

  private constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.cacheManager = new CacheManager();
    this.budgetTracker = new BudgetTracker();
    this.loggingService = LoggingService.getInstance();
  }

  // Méthode statique pour obtenir l'instance singleton
  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  async generateContent(params: AIRequestParams) {
    // Générer une clé de cache unique
    const cacheKey = this.generateCacheKey(params);
    
    // Vérification du cache
    const cachedResponse = this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      this.loggingService.log('Cache hit', { cacheKey });
      return cachedResponse;
    }

    // Vérification du budget
    if (!this.budgetTracker.canMakeRequest()) {
      this.loggingService.error('Budget limit reached');
      throw new Error('Budget limit reached');
    }

    try {
      // Préparation des paramètres spécifiques selon le type de requête
      const requestParams = this.prepareRequestParams(params);

      // Appel à l'API Claude
      const response = await this.client.messages.create(requestParams);

      // Mise en cache
      this.cacheManager.set(cacheKey, response);
      
      // Tracking budgétaire
      this.budgetTracker.trackRequest(response);

      // Logging de la requête
      this.loggingService.log('AI Request Processed', { 
        type: params.type, 
        model: params.model 
      });

      return response;
    } catch (error) {
      this.handleApiError(error, params);
      throw error;
    }
  }

  private prepareRequestParams(params: AIRequestParams) {
    const baseParams = {
      model: params.model || "claude-3-sonnet-20240229",
      max_tokens: params.maxTokens || 1000,
      messages: params.messages
    };

    // Personnalisation selon le type de requête
    switch(params.type) {
      case AIRequestType.RSS_ANALYSIS:
        return {
          ...baseParams,
          system: "You are an expert in analyzing RSS feeds for audiovisual project opportunities."
        };
      case AIRequestType.DOCUMENT_GENERATION:
        return {
          ...baseParams,
          system: "Help generate professional documents for audiovisual project submissions."
        };
      default:
        return baseParams;
    }
  }

  private generateCacheKey(params: AIRequestParams): string {
    // Génération d'une clé de cache unique basée sur les paramètres
    return JSON.stringify({
      type: params.type,
      messages: params.messages.map(m => m.content).join('|'),
      model: params.model
    });
  }

  private handleApiError(error: any, params: AIRequestParams) {
    // Logging détaillé des erreurs
    this.loggingService.error('Claude API Error', {
      type: params.type,
      error: error.message,
      stack: error.stack
    });

    // Possibilité d'implémenter une logique de retry sophistiquée
    // Notification du système en cas d'erreur critique
  }
}

export default AIServiceManager;