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

  async readFile(fileId: string): Promise<DriveResponse> {
    try {
      const cached = await this.cacheManager.getFile(fileId);
      if (cached) return cached;

      const response = await this.drive.files.get({
        fileId,
        alt: 'media'
      });

      await this.cacheManager.setFile(fileId, response.data);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleError('FILE_READ_ERROR', error);
    }
  }

  async updateFile(fileId: string, content: any): Promise<void> {
    try {
      await this.drive.files.update({
        fileId,
        media: {
          body: content
        }
      });

      await this.cacheManager.invalidateFile(fileId);
    } catch (error) {
      throw this.errorHandler.handleError('FILE_UPDATE_ERROR', error);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId
      });

      await this.cacheManager.invalidateFile(fileId);
    } catch (error) {
      throw this.errorHandler.handleError('FILE_DELETE_ERROR', error);
    }
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    try {
      const cached = await this.cacheManager.getMetadata(fileId);
      if (cached) return cached;

      const response = await this.drive.files.get({
        fileId,
        fields: '*'
      });

      await this.cacheManager.setMetadata(fileId, response.data);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleError('METADATA_ERROR', error);
    }
  }

  async executeOperation(operation: DriveOperation): Promise<any> {
    try {
      switch (operation.type) {
        case 'create':
          return await this.createFile(
            operation.metadata.name,
            operation.content,
            operation.metadata.folderId
          );
        case 'read':
          return await this.readFile(operation.fileId);
        case 'update':
          return await this.updateFile(operation.fileId, operation.content);
        case 'delete':
          return await this.deleteFile(operation.fileId);
        default:
          throw new Error(`Opération non supportée: ${operation.type}`);
      }
    } catch (error) {
      throw this.errorHandler.handleError('OPERATION_ERROR', error);
    }
  }

  private determineMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}

export default DriveCore;
