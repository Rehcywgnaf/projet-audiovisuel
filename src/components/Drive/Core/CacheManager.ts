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

  private constructor(config: CacheConfig) {
    this.memoryCache = new Map();
    this.config = config;
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
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du cache persistant:', error);
    }

    return null;
  }

  async set(key: string, data: DriveDocument): Promise<void> {
    this.setMemoryCache(key, data);
    await this.setPersistentCache(key, data);
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
        await localStorage.setItem(`drive_${key}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'écriture dans le cache persistant:', error);
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
    // Préchargement des documents selon les patterns configurés
    try {
      const keys = Object.keys(localStorage)
        .filter(key => key.startsWith('drive_'))
        .filter(key => 
          this.config.preloadPatterns.some(pattern => 
            new RegExp(pattern.replace('*', '.*')).test(key.slice(6))
          )
        );

      for (const key of keys) {
        const data = await localStorage.getItem(key);
        if (data) {
          const {data: doc, timestamp} = JSON.parse(data);
          if (this.isValid(timestamp)) {
            this.setMemoryCache(key.slice(6), doc);
          } else {
            await localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du préchargement du cache:', error);
    }
  }
}