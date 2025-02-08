import AIRoutingService from './AIRoutingService';
import type { 
  ClaudeModel,
  AIServiceStats,
  AIRequest,
  AIResponse,
  AIServiceConfig
} from './types';

class AIServiceManager {
  private static instance: AIServiceManager;
  private stats: Map<string, AIServiceStats>;
  private cache: Map<string, any>;
  private config: AIServiceConfig;
  private routingService: AIRoutingService;

  private constructor() {
    this.stats = new Map();
    this.cache = new Map();
    this.config = {
      apiKey: process.env.CLAUDE_API_KEY || '',
      defaultModel: (process.env.CLAUDE_SONNET_MODEL || 'claude-3-sonnet-20240229') as ClaudeModel,
      haiku: (process.env.CLAUDE_HAIKU_MODEL || 'claude-3-haiku-20240307') as ClaudeModel,
      maxCost: 15, // $15 par mois
      warningThreshold: 10 // Alerte à $10
    };
    this.routingService = AIRoutingService.getInstance();
    this.initializeStats();
  }

  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  private initializeStats() {
    const services = ['validator', 'suggester', 'analyzer', 'rss', 'editor'];
    services.forEach(service => {
      this.stats.set(service, {
        cacheHits: 0,
        totalRequests: 0,
        averageLatency: 0,
        lastProcessed: new Date(),
        totalCost: 0
      });
    });
  }

  private async callClaudeAPI(prompt: string, model: ClaudeModel): Promise<any> {
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229', // Utilisation du modèle le plus récent
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Claude API error:', errorBody);
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Claude API proxy error:', error);
      throw error;
    }
  }

  public async processRequest(service: string, operation: string, options?: AIRequest['options']): Promise<AIResponse> {
    // Vérifier le cache si activé
    if (options?.cache) {
      const cacheKey = `${service}-${operation}-${JSON.stringify(options)}`;
      const cachedResult = this.cache.get(cacheKey);
      if (cachedResult) {
        const currentStats = this.stats.get(service);
        if (currentStats) {
          this.stats.set(service, {
            ...currentStats,
            cacheHits: currentStats.cacheHits + 1
          });
        }
        return cachedResult;
      }
    }

    try {
      const startTime = Date.now();

      // Sélection du modèle avec un fallback
      const model = options?.complexity === 'simple' 
        ? this.config.haiku 
        : this.config.defaultModel;

      const response = await this.callClaudeAPI(operation, model);
      
      const latency = Date.now() - startTime;
      const cost = this.calculateCost(model, response.usage?.total_tokens || 0);
      
      this.updateStats(service, latency, cost);

      // Vérifier le budget
      const currentStats = this.stats.get(service);
      if (currentStats && currentStats.totalCost >= this.config.warningThreshold) {
        console.warn(`Warning: Service ${service} approaching budget limit`);
      }

      const result: AIResponse = {
        success: true,
        data: response,
        cost,
        model
      };

      // Mettre en cache si activé
      if (options?.cache) {
        const cacheKey = `${service}-${operation}-${JSON.stringify(options)}`;
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  }

  private calculateCost(model: ClaudeModel, tokens: number): number {
    // Coûts par token (à ajuster selon les tarifs réels)
    const costs = {
      'claude-3-sonnet-20240229': 0.00003,
      'claude-3-haiku-20240307': 0.00001
    };

    return tokens * (costs[model] || 0.00003);
  }

  private updateStats(service: string, latency: number, cost: number) {
    const currentStats = this.stats.get(service);
    if (currentStats) {
      const newStats = {
        ...currentStats,
        totalRequests: currentStats.totalRequests + 1,
        averageLatency: (currentStats.averageLatency * currentStats.totalRequests + latency) / (currentStats.totalRequests + 1),
        lastProcessed: new Date(),
        totalCost: currentStats.totalCost + cost
      };
      this.stats.set(service, newStats);
    }
  }

  public getStats(service: string): AIServiceStats | null {
    return this.stats.get(service) || null;
  }

  public getAllStats(): Map<string, AIServiceStats> {
    return new Map(this.stats);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getTotalCost(): number {
    let total = 0;
    this.stats.forEach(stat => {
      total += stat.totalCost;
    });
    return total;
  }
}

export default AIServiceManager;