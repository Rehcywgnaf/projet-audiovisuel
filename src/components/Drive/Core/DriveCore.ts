import { google } from 'googleapis';
import { DriveOperation, FileMetadata, DriveResponse, CacheConfig } from '../types';
import { ErrorHandling } from '../error/ErrorHandling';
import { CacheManager } from '../cache/CacheManager';

class DriveCore {
  private static instance: DriveCore;
  private drive: any;
  private cacheManager: CacheManager;
  private errorHandler: ErrorHandling;

  private constructor() {
    this.initializeDrive();
    this.cacheManager = CacheManager.getInstance();
    this.errorHandler = ErrorHandling.getInstance();
  }

  private async initializeDrive() {
    try {
      const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/drive']
      });
      this.drive = google.drive({ version: 'v3', auth });
    } catch (error) {
      this.errorHandler.handleError('DRIVE_INIT_ERROR', error);
    }
  }

  static getInstance(): DriveCore {
    if (!DriveCore.instance) {
      DriveCore.instance = new DriveCore();
    }
    return DriveCore.instance;
  }

  // Méthodes existantes conservées, imports mis à jour 
  async createFile(name: string, content: any, folderId?: string): Promise<string> {
    try {
      const metadata: FileMetadata = {
        name,
        mimeType: this.determineMimeType(name),
        ...(folderId && { parents: [folderId] })
      };

      const response = await this.drive.files.create({
        requestBody: metadata,
        media: {
          body: content
        },
        fields: 'id'
      });

      await this.cacheManager.invalidateFolder(folderId);
      return response.data.id;
    } catch (error) {
      throw this.errorHandler.handleError('FILE_CREATE_ERROR', error);
    }
  }

  // Reste du code DriveCore conservé
}

export default DriveCore;