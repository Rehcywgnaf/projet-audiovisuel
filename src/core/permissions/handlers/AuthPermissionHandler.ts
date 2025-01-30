import { EventSystem } from '../../EventSystem';
import { AuthPermission, PermissionLevel, PermissionAction } from '../types';

export class AuthPermissionHandler {
  private static instance: AuthPermissionHandler;
  private eventSystem: EventSystem;
  private permissions: Map<string, AuthPermission[]>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.permissions = new Map();
  }

  static getInstance(): AuthPermissionHandler {
    if (!AuthPermissionHandler.instance) {
      AuthPermissionHandler.instance = new AuthPermissionHandler();
    }
    return AuthPermissionHandler.instance;
  }

  async checkPermission(
    resourceId: string,
    userId: string,
    action: PermissionAction
  ): Promise<boolean> {
    const levelRequired = this.getLevelForAction(action);
    const perms = await this.getPermissions(resourceId);
    
    return perms.some(perm => {
      if (perm.userId !== userId) return false;
      if (perm.expiresAt && perm.expiresAt < Date.now()) return false;
      return perm.level >= levelRequired;
    });
  }

  async setPermission(permission: AuthPermission): Promise<void> {
    const existing = this.permissions.get(permission.resourceId) || [];
    const filtered = existing.filter(p => p.userId !== permission.userId);
    
    this.permissions.set(permission.resourceId, [...filtered, permission]);
    
    this.eventSystem.emit('authPermissionUpdated', { 
      resourceId: permission.resourceId,
      userId: permission.userId,
      level: permission.level
    });
  }

  async getPermissions(resourceId: string): Promise<AuthPermission[]> {
    // Nettoyer les permissions expirées lors de la récupération
    const perms = this.permissions.get(resourceId) || [];
    const validPerms = perms.filter(p => !p.expiresAt || p.expiresAt > Date.now());
    
    if (validPerms.length !== perms.length) {
      this.permissions.set(resourceId, validPerms);
    }
    
    return validPerms;
  }

  private getLevelForAction(action: PermissionAction): PermissionLevel {
    switch (action) {
      case 'read': return PermissionLevel.READ;
      case 'write': return PermissionLevel.EDIT;
      default: return PermissionLevel.NONE;
    }
  }
}