import { CacheError, CacheErrorType } from '../core/errors/CacheError';
import { CacheErrorHandler } from '../core/errors/CacheErrorHandler';
import { DriveDocument } from '../types';

export enum CachePriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface CacheConfig {
  memorySize: number;
  persistentSize: number;
  ttl: {
    [CachePriority.HIGH]: number;
    [CachePriority.MEDIUM]: number;
    [CachePriority.LOW]: number;
  };
  preloadPatterns: string[];
}

interface CacheMetrics {
  hits: number;
  misses: number;
  totalRequests: number;
  averageResponseTime: number;
  lastCleanup: number;
}

interface CacheItem {
  data: DriveDocument;
  timestamp: number;
  lastAccessed: number;
  priority: CachePriority;
  responseTime: number[];
}

export class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, CacheItem>;
  private config: CacheConfig;
  private errorHandler: CacheErrorHandler;
  private metrics: Map<CachePriority, CacheMetrics>;

  private constructor(config: CacheConfig) {
    this.memoryCache = new Map();
    this.config = config;
    this.errorHandler = CacheErrorHandler.getInstance();
    this.metrics = new Map(Object.values(CachePriority).map(priority => [
      priority,
      {
        hits: 0,
        misses: 0,
        totalRequests: 0,
        averageResponseTime: 0,
        lastCleanup: Date.now()
      }
    ]));
    this.startPeriodicCleanup();
  }

  static getInstance(config?: CacheConfig): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config || {
        memorySize: 100,
        persistentSize: 1000,
        ttl: {
          [CachePriority.HIGH]: 3600,    // 1 heure
          [CachePriority.MEDIUM]: 7200,  // 2 heures
          [CachePriority.LOW]: 86400     // 24 heures
        },
        preloadPatterns: ['*/templates/*', '*/recent/*']
      });
    }
    return CacheManager.instance;
  }

  async get(key: string, priority: CachePriority = CachePriority.MEDIUM): Promise<DriveDocument | null> {
    const startTime = performance.now();
    const metrics = this.metrics.get(priority)!;
    metrics.totalRequests++;

    try {
      const memoryItem = this.memoryCache.get(key);
      if (memoryItem) {
        if (this.isValid(memoryItem.timestamp, memoryItem.priority)) {
          memoryItem.lastAccessed = Date.now();
          this.updateMetrics(priority, startTime, true);
          return memoryItem.data;
        }
        this.memoryCache.delete(key);
      }

      try {
        const persistentData = await localStorage.getItem(`drive_${key}`);
        if (persistentData) {
          const {data, timestamp, priority: storedPriority} = JSON.parse(persistentData);
          if (this.isValid(timestamp, storedPriority)) {
            await this.set(key, data, priority);
            this.updateMetrics(priority, startTime, true);
            return data;
          }
          await localStorage.removeItem(`drive_${key}`);
        }
      } catch (error) {
        throw new CacheError(CacheErrorType.READ_ERROR, { key, error });
      }

      this.updateMetrics(priority, startTime, false);
      return null;

    } catch (error) {
      await this.errorHandler.handleError(
        error instanceof CacheError ? error : new CacheError(CacheErrorType.READ_ERROR, { key, error }),
        `get_${key}`
      );
      this.updateMetrics(priority, startTime, false);
      return null;
    }
  }

  async set(key: string, data: DriveDocument, priority: CachePriority = CachePriority.MEDIUM): Promise<void> {
    try {
      this.setMemoryCache(key, data, priority);
      await this.setPersistentCache(key, data, priority);
    } catch (error) {
      await this.errorHandler.handleError(
        error instanceof CacheError ? error : new CacheError(CacheErrorType.WRITE_ERROR, { key, error }),
        `set_${key}`
      );
    }
  }

  private updateMetrics(priority: CachePriority, startTime: number, isHit: boolean): void {
    const metrics = this.metrics.get(priority)!;
    const responseTime = performance.now() - startTime;
    
    if (isHit) {
      metrics.hits++;
    } else {
      metrics.misses++;
    }
    
    metrics.averageResponseTime = (
      (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) / 
      metrics.totalRequests
    );
  }

  private setMemoryCache(key: string, data: DriveDocument, priority: CachePriority): void {
    if (this.memoryCache.size >= this.config.memorySize) {
      this.evictLRU();
    }
    
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      priority,
      responseTime: []
    });
  }

  private evictLRU(): void {
    const entries = Array.from(this.memoryCache.entries());
    const priorityGroups = new Map<CachePriority, Array<[string, CacheItem]>>();
    
    // Group by priority
    entries.forEach(entry => {
      const group = priorityGroups.get(entry[1].priority) || [];
      group.push(entry);
      priorityGroups.set(entry[1].priority, group);
    });

    // Start evicting from lowest priority
    const priorities = [CachePriority.LOW, CachePriority.MEDIUM, CachePriority.HIGH];
    for (const priority of priorities) {
      const group = priorityGroups.get(priority);
      if (group && group.length > 0) {
        const oldest = group.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)[0];
        this.memoryCache.delete(oldest[0]);
        return;
      }
    }
  }

  private async setPersistentCache(key: string, data: DriveDocument, priority: CachePriority): Promise<void> {
    try {
      if (this.shouldPersist(key)) {
        const storageData = JSON.stringify({
          data,
          timestamp: Date.now(),
          priority
        });

        try {
          await localStorage.setItem(`drive_${key}`, storageData);
        } catch (error) {
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            throw new CacheError(CacheErrorType.QUOTA_EXCEEDED, { key });
          }
          throw new CacheError(CacheErrorType.WRITE_ERROR, { key, error });
        }
      }
    } catch (error) {
      throw new CacheError(CacheErrorType.WRITE_ERROR, { key, error });
    }
  }

  private isValid(timestamp: number, priority: CachePriority): boolean {
    return Date.now() - timestamp < this.config.ttl[priority] * 1000;
  }

  private shouldPersist(key: string): boolean {
    return this.config.preloadPatterns.some(pattern => 
      new RegExp(pattern.replace('*', '.*')).test(key)
    );
  }

  private startPeriodicCleanup(): void {
    setInterval(() => {
      try {
        this.cleanup();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }, 300000); // Every 5 minutes
  }

  private cleanup(): void {
    const now = Date.now();
    
    // Memory cache cleanup
    for (const [key, item] of this.memoryCache.entries()) {
      if (!this.isValid(item.timestamp, item.priority)) {
        this.memoryCache.delete(key);
      }
    }

    // Update cleanup timestamp
    this.metrics.forEach(metric => {
      metric.lastCleanup = now;
    });
  }

  getMetrics(): Map<CachePriority, CacheMetrics> {
    return new Map(this.metrics);
  }

  getStats(): {
    memoryCacheSize: number;
    persistentCacheSize: number;
    memoryUsage: number;
    hitRatio: { [key in CachePriority]: number };
    averageResponseTimes: { [key in CachePriority]: number };
  } {
    const hitRatio: { [key in CachePriority]: number } = {} as any;
    const averageResponseTimes: { [key in CachePriority]: number } = {} as any;

    this.metrics.forEach((metric, priority) => {
      hitRatio[priority] = metric.hits / (metric.hits + metric.misses) || 0;
      averageResponseTimes[priority] = metric.averageResponseTime;
    });

    return {
      memoryCacheSize: this.memoryCache.size,
      persistentCacheSize: Object.keys(localStorage)
        .filter(key => key.startsWith('drive_')).length,
      memoryUsage: this.estimateMemoryUsage(),
      hitRatio,
      averageResponseTimes
    };
  }

  private estimateMemoryUsage(): number {
    let usage = 0;
    this.memoryCache.forEach((item) => {
      usage += JSON.stringify(item).length * 2;
    });
    return usage;
  }
}