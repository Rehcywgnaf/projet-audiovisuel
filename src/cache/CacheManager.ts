export enum CachePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

type CacheEntry = {
  value: any;
  expiry: number;
  priority: CachePriority;
};

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry> = new Map();
  
  // TTL par priorité (en millisecondes)
  private ttl = {
    [CachePriority.LOW]: 5 * 60 * 1000,    // 5 minutes
    [CachePriority.MEDIUM]: 2 * 60 * 1000,  // 2 minutes
    [CachePriority.HIGH]: 60 * 1000         // 1 minute
  };

  private constructor() {
    // Nettoyage automatique toutes les minutes
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 60 * 1000);
    }
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async get(key: string, priority: CachePriority = CachePriority.MEDIUM): Promise<any | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: any, priority: CachePriority = CachePriority.MEDIUM): Promise<void> {
    const ttl = this.ttl[priority];
    const expiry = Date.now() + ttl;
    
    this.cache.set(key, {
      value,
      expiry,
      priority
    });
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): {
    size: number;
    lowPriority: number;
    mediumPriority: number;
    highPriority: number;
  } {
    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;

    for (const entry of this.cache.values()) {
      switch (entry.priority) {
        case CachePriority.LOW:
          lowCount++;
          break;
        case CachePriority.MEDIUM:
          mediumCount++;
          break;
        case CachePriority.HIGH:
          highCount++;
          break;
      }
    }

    return {
      size: this.cache.size,
      lowPriority: lowCount,
      mediumPriority: mediumCount,
      highPriority: highCount
    };
  }
}

// Export l'instance par défaut
export default CacheManager.getInstance();