import CacheManager from '../../../cache/CacheManager';
import { DriveDocument } from '../types';

export class DriveCore {
  private cacheManager: CacheManager;

  constructor() {
    this.cacheManager = CacheManager.getInstance();
  }

  async initialize(): Promise<void> {
    // Configuration spécifique si nécessaire
    this.cacheManager.configure({
      enabled: true,
      ttl: 3600,
      maxSize: 100
    });
  }

  async getDocument(id: string): Promise<DriveDocument> {
    const cachedDoc = await this.cacheManager.getFile(id);
    if (cachedDoc) {
      return cachedDoc;
    }

    const doc = await this.fetchFromDrive(id);
    await this.cacheManager.setFile(id, doc);
    return doc;
  }

  private async fetchFromDrive(id: string): Promise<DriveDocument> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur Drive: ${response.statusText}`);
      }

      const data = await response.json();
      return this.formatDriveDocument(data);
    } catch (error) {
      console.error('Erreur lors de la récupération depuis Drive:', error);
      throw error;
    }
  }

  private getAccessToken(): string {
    // À implémenter: récupération du token d'accès
    return 'access_token';
  }

  private formatDriveDocument(data: any): DriveDocument {
    return {
      id: data.id,
      name: data.name,
      mimeType: data.mimeType,
      modifiedTime: new Date(data.modifiedTime),
      size: data.size,
    };
  }
}