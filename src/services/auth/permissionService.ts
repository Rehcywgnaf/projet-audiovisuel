import { EventSystem } from '../../core/EventSystem';
import { PermissionLevel, Permission, PermissionAction } from './types/Permission';

interface PermissionEntry {
  userId: string;
  resourceId: string;
  level: PermissionLevel;
  teamId?: string;
}

export class PermissionService {
  private static instance: PermissionService;
  private permissions: Map<string, PermissionEntry>;
  private eventSystem: EventSystem;

  private constructor() {
    this.permissions = new Map();
    this.eventSystem = EventSystem.getInstance();
  }

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  async setPermission(
    resourceId: string,
    userId: string,
    level: PermissionLevel,
    teamId?: string
  ): Promise<void> {
    const permissionKey = `${resourceId}-${userId}`;
    const permission: PermissionEntry = { userId, resourceId, level, teamId };
    
    this.permissions.set(permissionKey, permission);
    
    this.eventSystem.emit('permissionChanged', {
      resourceId,
      userId,
      teamId,
      granted: true,
      level
    });
  }

  async checkPermission(
    resourceId: string,
    userId: string,
    requiredLevel: PermissionLevel
  ): Promise<boolean> {
    const permissionKey = `${resourceId}-${userId}`;
    const permission = this.permissions.get(permissionKey);

    if (!permission) return false;

    return permission.level >= requiredLevel;
  }

  async checkAction(
    resourceId: string,
    userId: string,
    action: PermissionAction
  ): Promise<boolean> {
    const levelRequired = this.getRequiredLevelForAction(action);
    return this.checkPermission(resourceId, userId, levelRequired);
  }

  async revokeAccess(resourceId: string, userId: string): Promise<void> {
    const permissionKey = `${resourceId}-${userId}`;
    const permission = this.permissions.get(permissionKey);

    if (permission) {
      this.permissions.delete(permissionKey);
      this.eventSystem.emit('permissionChanged', {
        resourceId,
        userId,
        teamId: permission.teamId,
        granted: false,
        level: PermissionLevel.NONE
      });
    }
  }

  async getPermissions(resourceId: string): Promise<PermissionEntry[]> {
    const resourcePermissions: PermissionEntry[] = [];
    
    this.permissions.forEach((permission) => {
      if (permission.resourceId === resourceId) {
        resourcePermissions.push(permission);
      }
    });

    return resourcePermissions;
  }

  async getUserPermissions(userId: string): Promise<PermissionEntry[]> {
    const userPermissions: PermissionEntry[] = [];
    
    this.permissions.forEach((permission) => {
      if (permission.userId === userId) {
        userPermissions.push(permission);
      }
    });

    return userPermissions;
  }

  private getRequiredLevelForAction(action: PermissionAction): PermissionLevel {
    switch (action) {
      case 'read':
        return PermissionLevel.READ;
      case 'write':
        return PermissionLevel.EDIT;
      case 'delete':
        return PermissionLevel.MANAGE;
      case 'share':
        return PermissionLevel.SHARE;
      case 'manage':
        return PermissionLevel.MANAGE;
      default:
        return PermissionLevel.NONE;
    }
  }
}