import Anthropic from '@anthropic-ai/sdk';
import { CacheManager } from './CacheManager';
import { BudgetTracker } from './BudgetTracker';
import { LoggingService } from './LoggingService';
import { EventSystem } from './EventSystem';

// Définition des types d'interaction avancés
export enum AIInteractionType {
  RSS_ANALYSIS = 'RSS_ANALYSIS',
  DOCUMENT_GENERATION = 'DOCUMENT_GENERATION',
  PROJECT_SUMMARY = 'PROJECT_SUMMARY',
  DEADLINE_ANALYSIS = 'DEADLINE_ANALYSIS',
  TEAM_OPTIMIZATION = 'TEAM_OPTIMIZATION',
  RESOURCE_ALLOCATION = 'RESOURCE_ALLOCATION'
}

export enum AIModelType {
  SONNET = 'SONNET',
  HAIKU = 'HAIKU',
  OPUS = 'OPUS'
}

export interface AIRequestParams {
  type: AIInteractionType;
  messages: Array<{ 
    role: 'user' | 'assistant' | 'system'; 
    content: string 
  }>;
  model?: AIModelType | string;
  maxTokens?: number;
  temperature?: number;
  context?: Record<string, any>;
  performanceMetrics?: {
    maxResponseTime?: number;
    priorityLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export interface AIResponse {
  content: string;
  model: string;
  tokens: {
    input: number;
    output: number;
  };
  metadata: {
    timestamp: string;
    interactionType: AIInteractionType;
    performanceMetrics?: Record<string, any>;
  };
}

export interface AIPerformanceMetrics {
  responseTime: number;
  tokenUsage: {
    input: number;
    output: number;
  };
  costEstimation: number;
  modelUsed: string;
}

const MODEL_MAPPING = {
  [AIModelType.SONNET]: process.env.CLAUDE_SONNET_MODEL || 'claude-3-5-sonnet-20240620',
  [AIModelType.HAIKU]: process.env.CLAUDE_HAIKU_MODEL || 'claude-3-haiku-20240307',
  [AIModelType.OPUS]: process.env.CLAUDE_OPUS_MODEL || 'claude-3-opus-20240229'
};

class AIServiceManager {
  private static instance: AIServiceManager | null = null;
  private client: Anthropic | null = null;
  private cacheManager: CacheManager;
  private budgetTracker: BudgetTracker;
  private loggingService: LoggingService;
  private eventSystem: EventSystem;
  private currentModel: string;

  private constructor() {
    this.cacheManager = new CacheManager();
    this.budgetTracker = new BudgetTracker();
    this.loggingService = LoggingService.getInstance();
    this.eventSystem = EventSystem.getInstance();
    this.currentModel = MODEL_MAPPING[AIModelType.SONNET];
    
    this.initializeClient();
  }

  private initializeClient() {
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

        this.validateApiConnection();
      } catch (error) {
        this.handleInitializationError(error);
      }
    }
  }

  private handleInitializationError(error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    
    this.loggingService.error('Anthropic Client Initialization Failed', { 
      error: errorMessage 
    });

    // Émission d'un événement système pour les erreurs critiques
    this.eventSystem.emit('system:critical-error', {
      component: 'AIServiceManager',
      errorType: 'INITIALIZATION_FAILED',
      details: errorMessage
    });

    throw error;
  }

  private async validateApiConnection() {
    const testModels = Object.values(MODEL_MAPPING);
    let connectionSuccessful = false;

    for (const model of testModels) {
      try {
        const startTime = Date.now();
        const testResponse = await this.client?.messages.create({
          model: model,
          max_tokens: 10,
          messages: [{ role: "user", content: "System diagnostic check" }]
        });

        const responseTime = Date.now() - startTime;

        if (testResponse) {
          this.currentModel = model;
          connectionSuccessful = true;
          
          this.loggingService.log('Anthropic API Connection Validated', { 
            model: this.currentModel,
            responseTime 
          });

          this.eventSystem.emit('ai:connection-validated', {
            model: this.currentModel,
            responseTime
          });

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

  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  private resolveModel(model?: AIModelType | string): string {
    if (!model) return this.currentModel;
    
    return Object.values(AIModelType).includes(model as AIModelType) 
      ? MODEL_MAPPING[model as AIModelType] 
      : model;
  }

  async generateContent(params: AIRequestParams): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('AI services are not available on the client side');
    }

    const selectedModel = this.resolveModel(params.model);
    const startTime = Date.now();

    // Vérification du cache et des permissions
    const cacheKey = this.generateCacheKey({...params, model: selectedModel});
    const cachedResponse = this.cacheManager.get(cacheKey);
    
    if (cachedResponse) {
      this.loggingService.log('Cache hit', { cacheKey });
      return cachedResponse;
    }

    if (!this.budgetTracker.canMakeRequest()) {
      this.loggingService.error('Budget limit reached');
      throw new Error('Budget limit reached');
    }

    try {
      const requestParams = this.prepareRequestParams({...params, model: selectedModel});
      
      const response = await this.client.messages.create(requestParams);

      const performanceMetrics: AIPerformanceMetrics = {
        responseTime: Date.now() - startTime,
        tokenUsage: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens
        },
        costEstimation: this.budgetTracker.estimateCost(response),
        modelUsed: selectedModel
      };

      const aiResponse: AIResponse = {
        content: response.content[0].text,
        model: selectedModel,
        tokens: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens
        },
        metadata: {
          timestamp: new Date().toISOString(),
          interactionType: params.type,
          performanceMetrics
        }
      };

      // Mise en cache
      this.cacheManager.set(cacheKey, aiResponse);
      
      // Tracking budgétaire
      this.budgetTracker.trackRequest(response);

      // Émission d'événement
      this.eventSystem.emit('ai:request-processed', {
        type: params.type,
        performanceMetrics
      });

      this.loggingService.log('AI Request Processed', { 
        type: params.type, 
        model: selectedModel,
        performanceMetrics
      });

      return aiResponse;
    } catch (error) {
      this.handleApiError(error, params);
      throw error;
    }
  }

  private prepareRequestParams(params: AIRequestParams) {
    const baseParams = {
      model: this.resolveModel(params.model),
      max_tokens: params.maxTokens || 1000,
      messages: params.messages,
      temperature: params.temperature || 0.7
    };

    const systemPrompts = {
      [AIInteractionType.RSS_ANALYSIS]: 
        "You are an expert in analyzing RSS feeds for audiovisual project opportunities.",
      [AIInteractionType.DOCUMENT_GENERATION]: 
        "Help generate professional documents for audiovisual project submissions.",
      [AIInteractionType.PROJECT_SUMMARY]: 
        "Provide a concise and insightful summary of project details.",
      default: "Provide helpful and context-aware assistance."
    };

    return {
      ...baseParams,
      system: systemPrompts[params.type] || systemPrompts.default
    };
  }

  private generateCacheKey(params: AIRequestParams): string {
    return JSON.stringify({
      type: params.type,
      messages: params.messages.map(m => m.content).join('|'),
      model: params.model
    });
  }

  private handleApiError(error: any, params: AIRequestParams) {
    this.loggingService.error('Claude API Error', {
      type: params.type,
      error: error.message,
      stack: error.stack
    });

    this.eventSystem.emit('ai:request-error', {
      type: params.type,
      error: error.message
    });
  }
}

export default AIServiceManager;