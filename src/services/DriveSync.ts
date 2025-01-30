import { CacheManager, CachePriority } from '../cache/CacheManager';
import { driveService } from './driveService';
import { DriveDocument } from '../types';

export class DriveSync {
  private cacheManager: CacheManager;
  private static instance: DriveSync;

  private constructor() {
    this.cacheManager = CacheManager.getInstance();
  }

  static getInstance(): DriveSync {
    if (!DriveSync.instance) {
      DriveSync.instance = new DriveSync();
    }
    return DriveSync.instance;
  }

  async syncFile(fileId: string, content: DriveDocument): Promise<void> {
    try {
      // Vérification du cache avant l'appel API
      const cachedContent = await this.cacheManager.get(
        `file_${fileId}`,
        CachePriority.HIGH
      );

      // Si le contenu est identique, pas besoin de sync
      if (cachedContent && JSON.stringify(cachedContent) === JSON.stringify(content)) {
        return;
      }

      // Sync avec Drive
      await driveService.updateFile(fileId, content);
      
      // Mise à jour du cache avec le nouveau contenu
      await this.cacheManager.set(
        `file_${fileId}`,
        content,
        CachePriority.HIGH
      );
    } catch (error) {
      console.error('Erreur synchronisation Drive:', error);
      throw error;
    }
  }

  async getFileContent(fileId: string): Promise<DriveDocument | null> {
    try {
      // Tentative depuis le cache
      const cachedContent = await this.cacheManager.get(
        `file_${fileId}`,
        CachePriority.HIGH
      );

      if (cachedContent) {
        return cachedContent;
      }

      // Si pas en cache, récupération depuis Drive
      const content = await driveService.getFile(fileId);
      
      if (content) {
        // Mise en cache avec priorité haute
        await this.cacheManager.set(
          `file_${fileId}`,
          content,
          CachePriority.HIGH
        );
      }

      return content;
    } catch (error) {
      console.error('Erreur récupération fichier:', error);
      throw error;
    }
  }

  async getStats(): Promise<{
    cacheStats: {
      memoryCacheSize: number;
      persistentCacheSize: number;
      memoryUsage: number;
      hitRatio: { [key: string]: number };
      averageResponseTimes: { [key: string]: number };
    };
  }> {
    return {
      cacheStats: this.cacheManager.getStats()
    };
  }
}