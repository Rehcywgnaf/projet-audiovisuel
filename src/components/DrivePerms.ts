import { Permission, PermissionLevel, AccessAudit } from '../types';

class DrivePerms {
  private static instance: DrivePerms;
  private permissions: Map<string, Permission[]> = new Map();
  private auditLog: AccessAudit[] = [];

  private constructor() {}

  static getInstance(): DrivePerms {
    if (!DrivePerms.instance) {
      DrivePerms.instance = new DrivePerms();
    }
    return DrivePerms.instance;
  }

  async checkPermission(userId: string, resourceId: string, level: PermissionLevel): Promise<boolean> {
    // Vérification pure des permissions
    const permissions = this.permissions.get(resourceId) || [];
    const userPerm = permissions.find(p => p.userId === userId);
    return userPerm?.level >= level || false;
  }

  async setPermission(permission: Permission): Promise<void> {
    const current = this.permissions.get(permission.resourceId) || [];
    const filtered = current.filter(p => p.userId !== permission.userId);
    this.permissions.set(permission.resourceId, [...filtered, permission]);
    
    this.logAudit({
      timestamp: new Date(),
      action: 'set_permission',
      userId: permission.userId,
      resourceId: permission.resourceId,
      level: permission.level
    });
  }

  async revokePermission(userId: string, resourceId: string): Promise<void> {
    const current = this.permissions.get(resourceId) || [];
    this.permissions.set(resourceId, current.filter(p => p.userId !== userId));
    
    this.logAudit({
      timestamp: new Date(),
      action: 'revoke_permission',
      userId,
      resourceId
    });
  }

  async getResourcePermissions(resourceId: string): Promise<Permission[]> {
    return this.permissions.get(resourceId) || [];
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userPerms: Permission[] = [];
    this.permissions.forEach((perms, resourceId) => {
      const userPerm = perms.find(p => p.userId === userId);
      if (userPerm) userPerms.push(userPerm);
    });
    return userPerms;
  }

  private logAudit(audit: AccessAudit): void {
    this.auditLog.push(audit);
  }

  async getAuditLog(resourceId?: string): Promise<AccessAudit[]> {
    if (resourceId) {
      return this.auditLog.filter(log => log.resourceId === resourceId);
    }
    return this.auditLog;
  }
}