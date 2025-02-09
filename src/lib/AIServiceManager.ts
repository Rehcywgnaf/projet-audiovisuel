import Anthropic from '@anthropic-ai/sdk';
import { CacheManager } from './CacheManager';
import { BudgetTracker } from './BudgetTracker';

export class AIServiceManager {
  private client: Anthropic;
  private cacheManager: CacheManager;
  private budgetTracker: BudgetTracker;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.cacheManager = new CacheManager();
    this.budgetTracker = new BudgetTracker();
  }

  async generateContent(params: {
    model?: string;
    messages: Array<{ role: string; content: string }>;
    maxTokens?: number;
  }) {
    const cacheKey = this.generateCacheKey(params);
    
    // Vérification cache
    const cachedResponse = this.cacheManager.get(cacheKey);
    if (cachedResponse) return cachedResponse;

    // Vérification budget
    if (!this.budgetTracker.canMakeRequest()) {
      throw new Error('Budget limit reached');
    }

    try {
      const response = await this.client.messages.create({
        model: params.model || "claude-3-sonnet-20240229",
        max_tokens: params.maxTokens || 1000,
        messages: params.messages
      });

      // Mise en cache
      this.cacheManager.set(cacheKey, response);
      
      // Tracking budgétaire
      this.budgetTracker.trackRequest(response);

      return response;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  private generateCacheKey(params) {
    // Logique de génération de clé de cache
    return JSON.stringify(params);
  }

  private handleApiError(error) {
    // Logging détaillé de l'erreur
    console.error('Claude API Error:', error);
    // Possibilité d'ajouter une logique de retry, notification, etc.
  }
}