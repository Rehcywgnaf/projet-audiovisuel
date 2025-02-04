import { AIServiceManager } from '../../lib/AIServiceManager';

// Mock Anthropic
jest.mock('@anthropic-ai/sdk', () => ({
  Anthropic: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockImplementation(async ({ messages }) => ({
        content: [{ text: 'Mocked response' }],
        usage: { output_tokens: 10 }
      }))
    }
  }))
}));

describe('AIServiceManager', () => {
  let aiManager: AIServiceManager;

  beforeEach(() => {
    // Reset les mocks et l'instance
    jest.clearAllMocks();
    aiManager = AIServiceManager.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('devrait toujours retourner la même instance', () => {
      const instance1 = AIServiceManager.getInstance();
      const instance2 = AIServiceManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Cache System', () => {
    it('devrait mettre en cache et réutiliser les résultats', async () => {
      const request = {
        component: 'rss-analyzer',
        content: 'test content',
        options: { maxTokens: 100 }
      };

      // Première requête
      const result1 = await aiManager.processRequest(
        request.component,
        request.content,
        request.options
      );

      // Deuxième requête identique
      const result2 = await aiManager.processRequest(
        request.component,
        request.content,
        request.options
      );

      const stats = aiManager.getStats(request.component);
      expect(stats.cacheHits).toBe(1);
      expect(result1).toEqual(result2);
    });

    it('devrait respecter les durées de cache par composant', async () => {
      const content = 'test content';
      
      // Test pour rss-analyzer (1h)
      await aiManager.processRequest('rss-analyzer', content, {});
      const statsRSS = aiManager.getStats('rss-analyzer');
      expect(statsRSS.cacheMisses).toBe(1);

      // Test pour editor (5min)
      await aiManager.processRequest('editor', content, {});
      const statsEditor = aiManager.getStats('editor');
      expect(statsEditor.cacheMisses).toBe(1);
    });
  });

  describe('Budget Management', () => {
    it('devrait suivre les dépenses correctement', async () => {
      const initialSpend = aiManager.getCurrentSpend();
      
      await aiManager.processRequest('rss-analyzer', 'test', {});
      
      const newSpend = aiManager.getCurrentSpend();
      expect(newSpend).toBeGreaterThan(initialSpend);
    });

    it('devrait rejeter les requêtes au-delà du budget', async () => {
      // Simuler un budget déjà élevé
      for (let i = 0; i < 100; i++) {
        await aiManager.processRequest('rss-analyzer', `test ${i}`, {});
      }

      await expect(
        aiManager.processRequest('rss-analyzer', 'over budget test', {})
      ).rejects.toThrow('Monthly budget limit reached');
    });
  });

  describe('Performance', () => {
    it('devrait traiter les requêtes dans les limites de temps', async () => {
      const start = performance.now();
      
      await aiManager.processRequest('rss-analyzer', 'test content', {});
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200); // 200ms max
    });
  });

  describe('Error Handling', () => {
    it('devrait gérer les erreurs de l\'API correctement', async () => {
      const anthropicError = new Error('API Error');
      jest.spyOn(global, 'console').mockImplementation(() => ({ error: jest.fn() }));
      
      const mockAnthropicClient = {
        messages: {
          create: jest.fn().mockRejectedValue(anthropicError)
        }
      };

      // @ts-ignore - Mock private property
      aiManager['anthropic'] = mockAnthropicClient;

      await expect(
        aiManager.processRequest('rss-analyzer', 'test content', {})
      ).rejects.toThrow('API Error');
    });
  });

  describe('Component Stats', () => {
    it('devrait maintenir des statistiques précises par composant', async () => {
      const component = 'rss-analyzer';
      
      // Faire plusieurs requêtes
      await aiManager.processRequest(component, 'test 1', {});
      await aiManager.processRequest(component, 'test 1', {}); // Cache hit
      await aiManager.processRequest(component, 'test 2', {}); // Cache miss
      
      const stats = aiManager.getStats(component);
      expect(stats.requests).toBe(3);
      expect(stats.cacheHits).toBe(1);
      expect(stats.cacheMisses).toBe(2);
    });
  });

  describe('Integration with Anthropic API', () => {
    it('devrait formater correctement les requêtes vers l\'API', async () => {
      await aiManager.processRequest('editor', 'test content', {
        maxTokens: 500
      });

      const anthropicInstance = new (require('@anthropic-ai/sdk').Anthropic)();
      expect(anthropicInstance.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          messages: [{ role: 'user', content: 'test content' }]
        })
      );
    });
  });
});