import { google, drive_v3 } from 'googleapis';
import { DriveOperation, FileMetadata, DriveResponse } from '../types';
import { ErrorHandling } from '../error/ErrorHandling';
import { CacheManager } from '../cache/CacheManager';

/**
 * Core component for Google Drive operations
 * Implements Singleton pattern and handles all direct Drive interactions
 */
class DriveCore {
  private static instance: DriveCore;
  private Drive: drive_v3.Drive;
  private cacheManager: CacheManager;
  private errorHandler: ErrorHandling;

  private constructor() {
    this.initializeDrive();
    this.cacheManager = CacheManager.getInstance();
    this.errorHandler = ErrorHandling.getInstance();
  }

  /**
   * Initialize Google Drive API connection
   */
  private async initializeDrive() {
    try {
      const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/drive']
      });
      this.Drive = google.drive({ version: 'v3', auth });
    } catch (error) {
      this.errorHandler.handleError('DRIVE_INIT_ERROR', error);
    }
  }

  /**
   * Get Singleton instance
   */
  static getInstance(): DriveCore {
    if (!DriveCore.instance) {
      DriveCore.instance = new DriveCore();
    }
    return DriveCore.instance;
  }

  /**
   * Create a new file in Drive
   * @param name File name
   * @param content File content
   * @param folderId Optional parent folder ID
   * @returns Created file ID
   */
  async createFile(name: string, content: any, folderId?: string): Promise<string> {
    try {
      const metadata: FileMetadata = {
        name,
        mimeType: this.determineMimeType(name),
        ...(folderId && { parents: [folderId] })
      };

      const response = await this.Drive.files.create({
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

  /**
   * Read file content from Drive
   * @param fileId File ID to read
   * @returns File content
   */
  async readFile(fileId: string): Promise<DriveResponse> {
    try {
      const cached = await this.cacheManager.getFile(fileId);
      if (cached) return cached;

      const response = await this.Drive.files.get({
        fileId,
        alt: 'media'
      });

      await this.cacheManager.setFile(fileId, response.data);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleError('FILE_READ_ERROR', error);
    }
  }

  /**
   * Update existing file in Drive
   * @param fileId File ID to update
   * @param content New content
   */
  async updateFile(fileId: string, content: any): Promise<void> {
    try {
      await this.Drive.files.update({
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

  /**
   * Delete file from Drive
   * @param fileId File ID to delete
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.Drive.files.delete({
        fileId
      });

      await this.cacheManager.invalidateFile(fileId);
    } catch (error) {
      throw this.errorHandler.handleError('FILE_DELETE_ERROR', error);
    }
  }

  /**
   * Get file metadata
   * @param fileId File ID
   * @returns File metadata
   */
  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    try {
      const cached = await this.cacheManager.getMetadata(fileId);
      if (cached) return cached;

      const response = await this.Drive.files.get({
        fileId,
        fields: '*'
      });

      await this.cacheManager.setMetadata(fileId, response.data);
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleError('METADATA_ERROR', error);
    }
  }

  /**
   * Execute generic Drive operation
   * @param operation Operation details
   * @returns Operation result
   */
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

  /**
   * Determine MIME type from filename
   * @param filename Name of file
   * @returns MIME type
   */
  private determineMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
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