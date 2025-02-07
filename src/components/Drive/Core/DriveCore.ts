import { DriveConfig } from '@/core/drive/DriveConfig';
import type { DriveOperation } from '../types';

export class DriveCore {
  private static instance: DriveCore;
  private driveConfig: DriveConfig;

  private constructor() {
    this.driveConfig = DriveConfig.getInstance();
  }

  public static getInstance(): DriveCore {
    if (!DriveCore.instance) {
      DriveCore.instance = new DriveCore();
    }
    return DriveCore.instance;
  }

  async executeOperation(operation: DriveOperation) {
    try {
      const driveAPI = this.driveConfig.getDriveAPI();
      
      switch (operation.type) {
        case 'list':
          return await driveAPI.files.list({
            pageSize: operation.pageSize,
            fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
            orderBy: 'modifiedTime desc'
          });

        case 'get':
          return await driveAPI.files.get({
            fileId: operation.fileId,
            fields: '*'
          });

        case 'create':
          return await driveAPI.files.create({
            requestBody: {
              name: operation.name,
              mimeType: operation.mimeType,
              parents: operation.parents
            },
            media: operation.media
          });

        case 'update':
          return await driveAPI.files.update({
            fileId: operation.fileId,
            requestBody: {
              name: operation.name,
              mimeType: operation.mimeType
            },
            media: operation.media
          });

        case 'delete':
          return await driveAPI.files.delete({
            fileId: operation.fileId
          });

        default:
          throw new Error(`Opération non supportée: ${operation.type}`);
      }
    } catch (error) {
      console.error('Erreur Drive Core:', error);
      throw error;
    }
  }
}

// Instance singleton exportée séparément
export const driveCore = DriveCore.getInstance();

// Export par défaut de la classe pour les cas où on veut accéder à getInstance()
export default DriveCore;