import { EventSystem } from '../../EventSystem';
import { FilePermission, PermissionLevel, PermissionAction } from '../types';

export class FilePermissionHandler {
  private static instance: FilePermissionHandler;
  private eventSystem: EventSystem;
  private permissions: Map<string, FilePermission[]>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.permissions = new Map();
    this.initializeEventListeners();
  }

  static getInstance(): FilePermissionHandler {
    if (!FilePermissionHandler.instance) {
      FilePermissionHandler.instance = new FilePermissionHandler();
    }
    return FilePermissionHandler.instance;
  }

  private initializeEventListeners(): void {
    this.eventSystem.on('filePermissionsUpdated', ({ fileId }) => {
      this.invalidatePermissions(fileId);
    });
  }

  async checkPermission(
    fileId: string,
    userId: string,
    action: PermissionAction
  ): Promise<boolean> {
    const levelRequired = this.getLevelForAction(action);
    const filePerms = await this.getPermissions(fileId);
    
    return filePerms.some(perm => 
      perm.userId === userId && perm.level >= levelRequired
    );
  }

  async setPermission(permission: FilePermission): Promise<void> {
    const existing = this.permissions.get(permission.fileId) || [];
    const filtered = existing.filter(p => p.userId !== permission.userId);
    
    this.permissions.set(permission.fileId, [...filtered, permission]);
    
    this.eventSystem.emit('filePermissionsUpdated', { 
      fileId: permission.fileId,
      userId: permission.userId,
      level: permission.level
    });
  }

  async getPermissions(fileId: string): Promise<FilePermission[]> {
    return this.permissions.get(fileId) || [];
  }

  private getLevelForAction(action: PermissionAction): PermissionLevel {
    switch (action) {
      case 'read': return PermissionLevel.READ;
      case 'write': return PermissionLevel.EDIT;
      case 'share': return PermissionLevel.SHARE;
      case 'manage': return PermissionLevel.MANAGE;
      default: return PermissionLevel.NONE;
    }
  }

  private invalidatePermissions(fileId: string): void {
    this.permissions.delete(fileId);
  }
}