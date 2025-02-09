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

// Liste des modèles supportés, avec le modèle recommandé en premier
const SUPPORTED_MODELS = [
  'claude-3-5-sonnet-20240620', // Modèle le plus récent
  'claude-3-sonnet-20240229',   // Ancien modèle (en deprecation)
  'claude-3-opus-20240229'      // Alternative
];

class AIServiceManager {
  private static instance: AIServiceManager | null = null;
  private client: Anthropic | null = null;
  private cacheManager: CacheManager;
  private budgetTracker: BudgetTracker;
  private loggingService: LoggingService;
  private currentModel: string;

  private constructor() {
    this.cacheManager = new CacheManager();
    this.budgetTracker = new BudgetTracker();
    this.loggingService = LoggingService.getInstance();
    this.currentModel = SUPPORTED_MODELS[0]; // Modèle par défaut
    
    // Initialisation conditionnelle du client
    this.initializeClient();
  }

  private initializeClient() {
    // Vérification côté serveur uniquement
    if (typeof window === 'undefined') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
      }

      try {
        this.client = new Anthropic({ 
          apiKey,
          dangerouslyAllowBrowser: false 
        });

        // Test de connexion 
        this.validateApiConnection();
      } catch (error) {
        this.loggingService.error('Anthropic Client Initialization Failed', { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        throw error;
      }
    }
  }

  private async validateApiConnection() {
    const testModels = [...SUPPORTED_MODELS];
    let connectionSuccessful = false;

    for (const model of testModels) {
      try {
        // Test minimal de connexion
        const testResponse = await this.client?.messages.create({
          model: model,
          max_tokens: 10,
          messages: [{ role: "user", content: "System check: Are you operational?" }]
        });

        if (testResponse) {
          this.currentModel = model;
          connectionSuccessful = true;
          
          // Log du modèle utilisé
          this.loggingService.log('Anthropic API Connection Validated', { 
            model: this.currentModel 
          });

          // Avertissement si modèle déprécié
          if (model !== SUPPORTED_MODELS[0]) {
            this.loggingService.warn('Deprecated Model in Use', {
              message: 'Current model is deprecated. Consider updating.',
              currentModel: model,
              recommendedModel: SUPPORTED_MODELS[0]
            });
          }

          break;
        }
      } catch (error) {
        this.loggingService.error('Model Connection Test Failed', { 
          model,
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    if (!connectionSuccessful) {
      throw new Error('All Anthropic API Connection Tests Failed');
    }
  }

  // Méthode statique pour obtenir l'instance singleton
  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  async generateContent(params: AIRequestParams) {
    // Vérification que le client est disponible
    if (!this.client) {
      this.loggingService.error('AI Client not initialized');
      throw new Error('AI services are not available on the client side');
    }

    // Utiliser le modèle courant si non spécifié
    const selectedModel = params.model || this.currentModel;

    // Génération d'une clé de cache unique
    const cacheKey = this.generateCacheKey({...params, model: selectedModel});
    
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
      const requestParams = this.prepareRequestParams({...params, model: selectedModel});

      // Appel à l'API Claude
      const response = await this.client.messages.create(requestParams);

      // Mise en cache
      this.cacheManager.set(cacheKey, response);
      
      // Tracking budgétaire
      this.budgetTracker.trackRequest(response);

      // Logging de la requête
      this.loggingService.log('AI Request Processed', { 
        type: params.type, 
        model: requestParams.model 
      });

      return response;
    } catch (error) {
      this.handleApiError(error, params);
      throw error;
    }
  }

  private prepareRequestParams(params: AIRequestParams) {
    const baseParams = {
      model: params.model || this.currentModel,
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