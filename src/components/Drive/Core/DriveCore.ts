import { DrivePerms } from './DrivePerms';

export interface DriveConfig {
  rootFolder: string;
  maxRetries: number;
  cacheTimeout: number;
  uploadChunkSize: number;
}

export class DriveCore {
  private static instance: DriveCore;
  private config: DriveConfig = {
    rootFolder: 'SAPAV',
    maxRetries: 3,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    uploadChunkSize: 5 * 1024 * 1024 // 5MB
  };
  
  private constructor() {}

  public static getInstance(): DriveCore {
    if (!DriveCore.instance) {
      DriveCore.instance = new DriveCore();
    }
    return DriveCore.instance;
  }

  async uploadFile(data: any) {
    const perms = DrivePerms.getInstance();
    if (!await perms.canUpload()) {
      throw new Error('Upload permission denied');
    }
    // Implementation
  }

  async updateFile(data: any) {
    const perms = DrivePerms.getInstance();
    if (!await perms.canModify(data.fileId)) {
      throw new Error('Update permission denied');
    }
    // Implementation
  }

  async deleteFile(data: any) {
    const perms = DrivePerms.getInstance();
    if (!await perms.canDelete(data.fileId)) {
      throw new Error('Delete permission denied');
    }
    // Implementation
  }

  getConfig(): DriveConfig {
    return this.config;
  }

  updateConfig(newConfig: Partial<DriveConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  resetConfig() {
    this.config = {
      rootFolder: 'SAPAV',
      maxRetries: 3,
      cacheTimeout: 5 * 60 * 1000,
      uploadChunkSize: 5 * 1024 * 1024
    };
  }
}

export default DriveCore.getInstance();