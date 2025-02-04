export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, any>;
  private metadata: Map<string, number>;
  private maxSize: number;

  private constructor() {
    this.cache = new Map();
    this.metadata = new Map();
    this.maxSize = 100;
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async getFile(fileId: string): Promise<any> {
    const now = Date.now();
    const meta = this.metadata.get(fileId);
    
    if (meta && now - meta < 3600000) { // 1 heure
      return this.cache.get(fileId);
    }
    
    return null;
  }

  async setFile(fileId: string, data: any): Promise<void> {
    this.cleanupIfNeeded();
    this.cache.set(fileId, data);
    this.metadata.set(fileId, Date.now());
  }

  async getMetadata(fileId: string): Promise<any> {
    return this.getFile(`meta_${fileId}`);
  }

  async setMetadata(fileId: string, data: any): Promise<void> {
    await this.setFile(`meta_${fileId}`, data);
  }

  async invalidateFile(fileId: string): Promise<void> {
    this.cache.delete(fileId);
    this.metadata.delete(fileId);
  }

  async invalidateFolder(folderId?: string): Promise<void> {
    if (!folderId) return;
    
    // Invalider tous les fichiers liés à ce dossier
    const keysToDelete = [];
    for (const [key, value] of this.cache.entries()) {
      if (value?.parents?.includes(folderId)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.invalidateFile(key);
    });
  }

  private cleanupIfNeeded(): void {
    if (this.cache.size >= this.maxSize) {
      // Supprimer les entrées les plus anciennes
      const sortedEntries = Array.from(this.metadata.entries())
        .sort(([, a], [, b]) => a - b);
      
      const toDelete = sortedEntries.slice(0, Math.floor(this.maxSize * 0.2));
      toDelete.forEach(([key]) => {
        this.invalidateFile(key);
      });
    }
  }
}

export default CacheManager;