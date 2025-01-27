import { EventSystem } from '../../core/EventSystem';
import { PermissionLevel } from '../../types';

interface Permission {
  userId: string;
  resourceId: string;
  level: PermissionLevel;
  teamId?: string;
}

export class PermissionService {
  private static instance: PermissionService;
  private permissions: Map<string, Permission>;
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
    const permission: Permission = { userId, resourceId, level, teamId };
    
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
    level: PermissionLevel
  ): Promise<boolean> {
    const permissionKey = `${resourceId}-${userId}`;
    const permission = this.permissions.get(permissionKey);

    if (!permission) return false;

    // Comparaison des niveaux de permission
    return permission.level >= level;
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

  async getPermissions(resourceId: string): Promise<Permission[]> {
    const resourcePermissions: Permission[] = [];
    
    this.permissions.forEach((permission) => {
      if (permission.resourceId === resourceId) {
        resourcePermissions.push(permission);
      }
    });

    return resourcePermissions;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userPermissions: Permission[] = [];
    
    this.permissions.forEach((permission) => {
      if (permission.userId === userId) {
        userPermissions.push(permission);
      }
    });

    return userPermissions;
  }
}