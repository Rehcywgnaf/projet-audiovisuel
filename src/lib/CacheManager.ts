export class CacheManager {
  private cache: Map<string, any> = new Map();
  private MAX_CACHE_SIZE = 100; // Limite de 100 entrées

  set(key: string, value: any, ttl: number = 3600000) { // Défaut 1 heure
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Supprimer la première entrée si le cache est plein
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const cacheEntry = {
      value,
      expires: Date.now() + ttl
    };

    this.cache.set(key, cacheEntry);
  }

  get(key: string): any {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (entry.expires < Date.now()) {
      // Entrée expirée
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}