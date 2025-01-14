interface CacheEntry<T> {
  value: T;
  expiry: number;
}

class PermissionCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly ttl: number;

  constructor(ttl = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  async get<T>(key: string): Promise<T | null> {
    this.cleanup();
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    this.cleanup();
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const permissionCache = new PermissionCache();
export default PermissionCache;