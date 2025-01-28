import { drive_v3, google } from 'googleapis';
import { DriveOperation, FileMetadata, DriveResponse } from '../types';
import { ErrorHandling } from '../error/ErrorHandling';
import { CacheManager } from '../cache/CacheManager';
import { AuthService } from '../../../services/auth/AuthService';
import { PermissionService } from '../../../services/auth/PermissionService';

/**
 * Core component for Google Drive operations
 * Implements Singleton pattern and handles all direct Drive interactions
 */
class DriveCore {
  private static instance: DriveCore;
  private drive: drive_v3.Drive;
  private cacheManager: CacheManager;
  private errorHandler: ErrorHandling;
  private authService: AuthService;
  private permissionService: PermissionService;

  private constructor() {
    this.cacheManager = CacheManager.getInstance();
    this.errorHandler = ErrorHandling.getInstance();
    this.authService = AuthService.getInstance();
    this.permissionService = new PermissionService();
  }

  /**
   * Initialize Google Drive API connection
   */
  private async initializeDrive(): Promise<void> {
    try {
      const token = await this.authService.authenticate();
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: token });
      
      this.drive = google.drive({ version: 'v3', auth });
    } catch (error) {
      throw this.errorHandler.handleError('DRIVE_INIT_ERROR', error);
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
   * Ensure drive is initialized before operations
   */
  private async ensureDriveInitialized(): Promise<void> {
    if (!this.drive) {
      await this.initializeDrive();
    }
  }

  /**
   * Check operation permissions
   */
  private async checkPermission(fileId: string, operation: 'read' | 'write' | 'delete'): Promise<void> {
    const hasPermission = await this.permissionService.checkPermission(fileId, operation);
    if (!hasPermission) {
      throw this.errorHandler.handleError(
        'PERMISSION_DENIED',
        new Error(`Permission denied for operation ${operation} on file ${fileId}`)
      );
    }
  }

  /**
   * Sync changes with Google Drive
   */
  async sync(): Promise<void> {
    try {
      await this.ensureDriveInitialized();

      // Mise à jour du cache local
      await this.cacheManager.refreshCache();

      // Liste des changements en attente
      const changes = await this.drive.changes.list({
        pageToken: await this.getLatestChangeToken(),
        spaces: 'drive'
      });

      // Traitement des changements
      for (const change of changes.data.changes || []) {
        if (change.file) {
          await this.cacheManager.invalidateFile(change.fileId);
          if (change.removed || change.file.trashed) {
            await this.cacheManager.removeFromCache(change.fileId);
          }
        }
      }

      // Sauvegarde du nouveau token
      if (changes.data.newStartPageToken) {
        await this.saveChangeToken(changes.data.newStartPageToken);
      }
    } catch (error) {
      throw this.errorHandler.handleError('SYNC_ERROR', error);
    }
  }

  /**
   * Get cache metrics
   */
  async getCacheMetrics(): Promise<{ hitRate: number; size: number; lastCleared: Date }> {
    return this.cacheManager.getMetrics();
  }

  /**
   * Get latest change token
   */
  private async getLatestChangeToken(): Promise<string> {
    try {
      const response = await this.drive.changes.getStartPageToken({});
      return response.data.startPageToken;
    } catch (error) {
      throw this.errorHandler.handleError('TOKEN_ERROR', error);
    }
  }

  /**
   * Save change token for future sync
   */
  private async saveChangeToken(token: string): Promise<void> {
    localStorage.setItem('driveChangeToken', token);
  }

  /**
   * Create a new file in Drive
   */
  async createFile(name: string, content: any, folderId?: string): Promise<string> {
    try {
      await this.ensureDriveInitialized();
      if (folderId) {
        await this.checkPermission(folderId, 'write');
      }

      const metadata: FileMetadata = {
        name,
        mimeType: this.determineMimeType(name),
        ...(folderId && { parents: [folderId] })
      };

      const response = await this.drive.files.create({
        requestBody: metadata,
        media: { body: content },
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
   */
  async readFile(fileId: string): Promise<DriveResponse> {
    try {
      await this.ensureDriveInitialized();
      await this.checkPermission(fileId, 'read');

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

  /**
   * Update existing file in Drive
   */
  async updateFile(fileId: string, content: any): Promise<void> {
    try {
      await this.ensureDriveInitialized();
      await this.checkPermission(fileId, 'write');

      await this.drive.files.update({
        fileId,
        media: { body: content }
      });

      await this.cacheManager.invalidateFile(fileId);
    } catch (error) {
      throw this.errorHandler.handleError('FILE_UPDATE_ERROR', error);
    }
  }

  /**
   * Delete file from Drive
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.ensureDriveInitialized();
      await this.checkPermission(fileId, 'delete');

      await this.drive.files.delete({ fileId });
      await this.cacheManager.invalidateFile(fileId);
    } catch (error) {
      throw this.errorHandler.handleError('FILE_DELETE_ERROR', error);
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    try {
      await this.ensureDriveInitialized();
      await this.checkPermission(fileId, 'read');

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

  /**
   * Execute generic Drive operation
   */
  async executeOperation(operation: DriveOperation): Promise<any> {
    try {
      await this.ensureDriveInitialized();
      
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