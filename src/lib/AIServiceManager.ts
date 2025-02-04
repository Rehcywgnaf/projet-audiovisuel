import { Anthropic } from '@anthropic-ai/sdk';

// Types
export interface RequestOptions {
  component: 'rss-analyzer' | 'editor' | 'validator' | 'template';
  priority: 'high' | 'medium' | 'low';
  maxTokens?: number;
}

interface CacheConfig {
  duration: number; // in milliseconds
  priority: 'high' | 'medium' | 'low';
  maxSize: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  component: string;
}

interface ComponentStats {
  requests: number;
  tokensUsed: number;
  cacheHits: number;
  cacheMisses: number;
  averageLatency: number;
}

export class AIServiceManager {
  private static instance: AIServiceManager;
  private anthropic: Anthropic;
  private cache: Map<string, CacheEntry>;
  private monthlySpend: number;
  private stats: Map<string, ComponentStats>;
  
  private cacheConfigs: Record<string, CacheConfig> = {
    'rss-analyzer': { duration: 3600000, priority: 'high', maxSize: 100 }, // 1h
    'editor': { duration: 300000, priority: 'medium', maxSize: 50 }, // 5min
    'validator': { duration: 600000, priority: 'medium', maxSize: 50 }, // 10min
    'template': { duration: 86400000, priority: 'low', maxSize: 200 } // 24h
  };

  private constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.cache = new Map();
    this.monthlySpend = 0;
    this.stats = new Map();
    this.initializeStats();
    this.startMonthlyReset();
  }

  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  private initializeStats() {
    const components = ['rss-analyzer', 'editor', 'validator', 'template'];
    components.forEach(component => {
      this.stats.set(component, {
        requests: 0,
        tokensUsed: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageLatency: 0
      });
    });
  }

  private startMonthlyReset() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const timeUntilReset = nextMonth.getTime() - now.getTime();

    setTimeout(() => {
      this.monthlySpend = 0;
      this.startMonthlyReset();
    }, timeUntilReset);
  }

  private checkBudget(estimatedCost: number): boolean {
    const projectedSpend = this.monthlySpend + estimatedCost;
    
    if (projectedSpend >= 15) {
      throw new Error('Monthly budget limit reached');
    }

    if (projectedSpend >= 10) {
      console.warn('Critical: 10$ budget threshold reached');
    } else if (projectedSpend >= 8) {
      console.warn('Warning: 8$ budget threshold reached');
    } else if (projectedSpend >= 5) {
      console.warn('Notice: 5$ budget threshold reached');
    }

    return true;
  }

  private getCacheKey(component: string, content: string): string {
    return `${component}-${content}`;
  }

  private updateStats(component: string, latency: number, tokensUsed: number, cacheHit: boolean) {
    const stats = this.stats.get(component);
    if (!stats) return;

    stats.requests++;
    stats.tokensUsed += tokensUsed;
    if (cacheHit) {
      stats.cacheHits++;
    } else {
      stats.cacheMisses++;
    }
    stats.averageLatency = ((stats.averageLatency * (stats.requests - 1)) + latency) / stats.requests;
  }

  public async processRequest(component: string, content: string, options: RequestOptions): Promise<any> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(component, content);
    const cacheConfig = this.cacheConfigs[component];

    // Check cache
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp) < cacheConfig.duration) {
      this.updateStats(component, Date.now() - startTime, 0, true);
      return cachedResult.data;
    }

    // Estimate cost and check budget
    const estimatedCost = 0.03; // Example: 0.03$ per query
    this.checkBudget(estimatedCost);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: options.maxTokens || 1024,
        messages: [{ role: 'user', content: content }]
      });

      const result = response.content[0].text;
      
      // Update cache
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        component: component
      });

      // Update stats and costs
      const tokensUsed = response.usage?.output_tokens || 0;
      this.monthlySpend += estimatedCost;
      this.updateStats(component, Date.now() - startTime, tokensUsed, false);

      return result;

    } catch (error) {
      console.error(`AIServiceManager error: ${error.message}`);
      throw error;
    }
  }

  public getStats(component: string): ComponentStats | null {
    return this.stats.get(component) || null;
  }

  public getCurrentSpend(): number {
    return this.monthlySpend;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export default AIServiceManager.getInstance();