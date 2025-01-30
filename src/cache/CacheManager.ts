import { CacheError, CacheErrorType } from '../core/errors/CacheError';
import { CacheErrorHandler } from '../core/errors/CacheErrorHandler';
import { DriveDocument } from '../types';

export interface CacheConfig {
  memorySize: number;
  persistentSize: number;
  ttl: number;
  preloadPatterns: string[];
}

export class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, {data: DriveDocument; timestamp: number}>;
  private config: CacheConfig;
  private errorHandler: CacheErrorHandler;

  private constructor(config: CacheConfig) {
    this.memoryCache = new Map();
    this.config = config;
    this.errorHandler = CacheErrorHandler.getInstance();
  }

  static getInstance(config?: CacheConfig): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config || {
        memorySize: 100,
        persistentSize: 1000,
        ttl: 3600,
        preloadPatterns: ['*/templates/*', '*/recent/*']
      });
    }
    return CacheManager.instance;
  }

  async get(key: string): Promise<DriveDocument | null> {
    try {
      const memoryItem = this.memoryCache.get(key);
      if (memoryItem) {
        if (this.isValid(memoryItem.timestamp)) {
          return memoryItem.data;
        }
        this.memoryCache.delete(key);
      }

      // Essayer le cache persistant si pas en mémoire
      try {
        const persistentData = await localStorage.getItem(`drive_${key}`);
        if (persistentData) {
          const {data, timestamp} = JSON.parse(persistentData);
          if (this.isValid(timestamp)) {
            this.setMemoryCache(key, data);
            return data;
          }
          await localStorage.removeItem(`drive_${key}`);
          throw new CacheError(CacheErrorType.EXPIRED_DATA, { key });
        }
      } catch (error) {
        throw new CacheError(CacheErrorType.READ_ERROR, { key, error });
      }

      return null;
    } catch (error) {
      await this.errorHandler.handleError(
        error instanceof CacheError ? error : new CacheError(CacheErrorType.READ_ERROR, { key, error }),
        `get_${key}`
      );
      return null;
    }
  }

  async set(key: string, data: DriveDocument): Promise<void> {
    try {
      this.setMemoryCache(key, data);
      await this.setPersistentCache(key, data);
    } catch (error) {
      await this.errorHandler.handleError(
        error instanceof CacheError ? error : new CacheError(CacheErrorType.WRITE_ERROR, { key, error }),
        `set_${key}`
      );
    }
  }

  private setMemoryCache(key: string, data: DriveDocument): void {
    if (this.memoryCache.size >= this.config.memorySize) {
      const oldestKey = Array.from(this.memoryCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.memoryCache.delete(oldestKey);
    }
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private async setPersistentCache(key: string, data: DriveDocument): Promise<void> {
    try {
      if (this.shouldPersist(key)) {
        const storageData = JSON.stringify({
          data,
          timestamp: Date.now()
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

  private isValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.ttl * 1000;
  }

  private shouldPersist(key: string): boolean {
    return this.config.preloadPatterns.some(pattern => 
      new RegExp(pattern.replace('*', '.*')).test(key)
    );
  }

  async preload(): Promise<void> {
    try {
      const keys = Object.keys(localStorage)
        .filter(key => key.startsWith('drive_'))
        .filter(key => 
          this.config.preloadPatterns.some(pattern => 
            new RegExp(pattern.replace('*', '.*')).test(key.slice(6))
          )
        );

      for (const key of keys) {
        try {
          const data = await localStorage.getItem(key);
          if (data) {
            const {data: doc, timestamp} = JSON.parse(data);
            if (this.isValid(timestamp)) {
              this.setMemoryCache(key.slice(6), doc);
            } else {
              await localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Continuer avec les autres clés même si une échoue
          console.warn('Error preloading key:', key, error);
        }
      }
    } catch (error) {
      throw new CacheError(
        CacheErrorType.INITIALIZATION_FAILED,
        { error }
      );
    }
  }

  clear(): void {
    this.memoryCache.clear();
    // Ne pas vider le localStorage ici car d'autres parties de l'app peuvent l'utiliser
  }

  getStats(): {
    memoryCacheSize: number;
    persistentCacheSize: number;
    memoryUsage: number;
  } {
    return {
      memoryCacheSize: this.memoryCache.size,
      persistentCacheSize: Object.keys(localStorage)
        .filter(key => key.startsWith('drive_')).length,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): number {
    // Estimation basique en octets
    let usage = 0;
    this.memoryCache.forEach((item) => {
      usage += JSON.stringify(item).length * 2; // * 2 pour estimation UTF-16
    });
    return usage;
  }
}