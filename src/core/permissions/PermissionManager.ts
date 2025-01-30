import { Permission, PermissionRequest } from './types';
import { FilePermissionHandler } from './handlers/FilePermissionHandler';
import { AuthPermissionHandler } from './handlers/AuthPermissionHandler';

export class PermissionManager {
  private static instance: PermissionManager;
  private fileHandler: FilePermissionHandler;
  private authHandler: AuthPermissionHandler;

  private constructor() {
    this.fileHandler = FilePermissionHandler.getInstance();
    this.authHandler = AuthPermissionHandler.getInstance();
  }

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  async checkPermission(request: PermissionRequest): Promise<boolean> {
    switch (request.type) {
      case 'file':
        return this.fileHandler.checkPermission(
          request.resourceId,
          request.userId,
          request.action
        );
      
      case 'auth':
        return this.authHandler.checkPermission(
          request.resourceId,
          request.userId,
          request.action
        );
      
      default:
        return false;
    }
  }

  async setPermission(permission: Permission): Promise<void> {
    switch (permission.type) {
      case 'file':
        await this.fileHandler.setPermission(permission);
        break;
      
      case 'auth':
        await this.authHandler.setPermission(permission);
        break;
    }
  }

  async getPermissions(type: Permission['type'], resourceId: string): Promise<Permission[]> {
    switch (type) {
      case 'file':
        return this.fileHandler.getPermissions(resourceId);
      
      case 'auth':
        return this.authHandler.getPermissions(resourceId);
      
      default:
        return [];
    }
  }
}