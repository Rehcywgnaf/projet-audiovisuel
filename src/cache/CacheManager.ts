interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time To Live en secondes
  maxSize: number; // Nombre maximum d'entrées
}

interface CacheEntry {
  value: any;
  timestamp: number;
}

class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig = {
    enabled: true,
    ttl: 3600,
    maxSize: 100
  };

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  configure(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async getFile(key: string): Promise<any | null> {
    if (!this.config.enabled) {
      return null;
    }

    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.config.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async setFile(key: string, value: any): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.findOldestEntry();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  async getCacheMetrics() {
    const now = Date.now();
    let hitCount = 0;
    let totalCount = 0;

    this.cache.forEach((entry) => {
      totalCount++;
      if (now - entry.timestamp <= this.config.ttl * 1000) {
        hitCount++;
      }
    });

    return {
      hitRate: totalCount > 0 ? (hitCount / totalCount) * 100 : 100,
      size: this.cache.size,
      lastCleared: new Date(this.findOldestEntry() || Date.now())
    };
  }

  private findOldestEntry(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }
}

export default CacheManager;