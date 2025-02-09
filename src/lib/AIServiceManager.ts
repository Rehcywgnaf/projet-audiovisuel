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

export enum AIModelType {
  SONNET = 'SONNET',
  HAIKU = 'HAIKU',
  OPUS = 'OPUS'
}

export interface AIRequestParams {
  type: AIRequestType;
  messages: Array<{ role: string; content: string }>;
  model?: AIModelType | string;
  maxTokens?: number;
  additionalContext?: Record<string, any>;
}

const MODEL_MAPPING = {
  [AIModelType.SONNET]: process.env.CLAUDE_SONNET_MODEL || 'claude-3-5-sonnet-20240620',
  [AIModelType.HAIKU]: process.env.CLAUDE_HAIKU_MODEL || 'claude-3-haiku-20240307',
  [AIModelType.OPUS]: process.env.CLAUDE_OPUS_MODEL || 'claude-3-opus-20240229'
};

const SUPPORTED_MODELS = Object.values(MODEL_MAPPING);

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
    this.currentModel = MODEL_MAPPING[AIModelType.SONNET]; // Modèle par défaut
    
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
          if (model !== MODEL_MAPPING[AIModelType.SONNET]) {
            this.loggingService.warn('Deprecated Model in Use', {
              message: 'Current model is deprecated. Consider updating.',
              currentModel: model,
              recommendedModel: MODEL_MAPPING[AIModelType.SONNET]
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

  // Helper pour convertir AIModelType en string de modèle
  private resolveModel(model?: AIModelType | string): string {
    if (!model) return this.currentModel;
    
    // Si c'est un enum AIModelType, convertir
    if (Object.values(AIModelType).includes(model as AIModelType)) {
      return MODEL_MAPPING[model as AIModelType];
    }
    
    // Sinon, retourner directement
    return model;
  }

  async generateContent(params: AIRequestParams) {
    // Vérification que le client est disponible
    if (!this.client) {
      this.loggingService.error('AI Client not initialized');
      throw new Error('AI services are not available on the client side');
    }

    // Résolution du modèle
    const selectedModel = this.resolveModel(params.model);

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
      model: this.resolveModel(params.model),
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

  // Reste du code inchangé...
}

export default AIServiceManager;