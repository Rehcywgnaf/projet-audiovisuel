import { CacheManager, CachePriority } from '../CacheManager';

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    localStorage.clear();
    
    // @ts-ignore: Accessing private static member for testing
    CacheManager.instance = undefined;
    
    cacheManager = CacheManager.getInstance({
      memorySize: 10,
      persistentSize: 100,
      ttl: {
        [CachePriority.HIGH]: 60,    // 1 minute for testing
        [CachePriority.MEDIUM]: 120, // 2 minutes
        [CachePriority.LOW]: 180     // 3 minutes
      },
      preloadPatterns: ['*/test/*']
    });
  });

  describe('Basic Operations', () => {
    it('should store and retrieve items', async () => {
      const testDoc = { id: '1', content: 'test' };
      await cacheManager.set('test-key', testDoc, CachePriority.HIGH);
      const retrieved = await cacheManager.get('test-key', CachePriority.HIGH);
      expect(retrieved).toEqual(testDoc);
    });

    it('should handle missing items', async () => {
      const retrieved = await cacheManager.get('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should respect TTL based on priority', async () => {
      const testDoc = { id: '1', content: 'test' };
      
      // Store with LOW priority
      await cacheManager.set('low-key', testDoc, CachePriority.LOW);
      
      // Fast-forward time by 2 minutes
      jest.advanceTimersByTime(120000);
      
      // LOW priority item should still be valid (3 min TTL)
      let retrieved = await cacheManager.get('low-key', CachePriority.LOW);
      expect(retrieved).toEqual(testDoc);
      
      // Store with HIGH priority
      await cacheManager.set('high-key', testDoc, CachePriority.HIGH);
      
      // Fast-forward time by 1.5 minutes
      jest.advanceTimersByTime(90000);
      
      // HIGH priority item should be expired (1 min TTL)
      retrieved = await cacheManager.get('high-key', CachePriority.HIGH);
      expect(retrieved).toBeNull();
    });
  });

  describe('Memory Management', () => {
    it('should evict items when cache is full', async () => {
      // Fill cache to capacity
      for (let i = 0; i < 10; i++) {
        await cacheManager.set(
          `key-${i}`,
          { id: i.toString(), content: `test-${i}` },
          CachePriority.LOW
        );
      }

      // Add one more item
      await cacheManager.set(
        'overflow-key',
        { id: 'overflow', content: 'test-overflow' },
        CachePriority.HIGH
      );

      // Verify that the high priority item was stored
      const retrieved = await cacheManager.get('overflow-key', CachePriority.HIGH);
      expect(retrieved).toBeTruthy();
      
      // Verify that total cache size hasn't exceeded limit
      const stats = cacheManager.getStats();
      expect(stats.memoryCacheSize).toBeLessThanOrEqual(10);
    });

    it('should prioritize items based on priority during eviction', async () => {
      // Fill cache with LOW priority items
      for (let i = 0; i < 9; i++) {
        await cacheManager.set(
          `low-${i}`,
          { id: i.toString(), content: `test-${i}` },
          CachePriority.LOW
        );
      }

      // Add a HIGH priority item
      await cacheManager.set(
        'high-key',
        { id: 'high', content: 'test-high' },
        CachePriority.HIGH
      );

      // Add another item to trigger eviction
      await cacheManager.set(
        'new-key',
        { id: 'new', content: 'test-new' },
        CachePriority.LOW
      );

      // HIGH priority item should still be in cache
      const highPriorityItem = await cacheManager.get('high-key', CachePriority.HIGH);
      expect(highPriorityItem).toBeTruthy();
    });
  });

  describe('Performance Metrics', () => {
    it('should track hit rates correctly', async () => {
      const testDoc = { id: '1', content: 'test' };
      
      // Store and retrieve an item
      await cacheManager.set('hit-test', testDoc, CachePriority.HIGH);
      await cacheManager.get('hit-test', CachePriority.HIGH);
      await cacheManager.get('miss-test', CachePriority.HIGH);

      const stats = cacheManager.getStats();
      const highPriorityHitRatio = stats.hitRatio[CachePriority.HIGH];
      expect(highPriorityHitRatio).toBe(0.5); // 1 hit, 1 miss
    });

    it('should track response times', async () => {
      const testDoc = { id: '1', content: 'test' };
      await cacheManager.set('time-test', testDoc, CachePriority.HIGH);
      await cacheManager.get('time-test', CachePriority.HIGH);

      const stats = cacheManager.getStats();
      expect(stats.averageResponseTimes[CachePriority.HIGH]).toBeGreaterThan(0);
    });
  });
});