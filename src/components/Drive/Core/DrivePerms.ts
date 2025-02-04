import { EventSystem } from '../../core/EventSystem';
import { PermissionLevel, Permission } from '../types';

export class DrivePerms {
  private static instance: DrivePerms;
  private eventSystem: EventSystem;
  private permissions: Map<string, Permission[]>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.permissions = new Map();
    this.initRoleListener();
  }

  static getInstance(): DrivePerms {
    if (!DrivePerms.instance) {
      DrivePerms.instance = new DrivePerms();
    }
    return DrivePerms.instance;
  }

  setPermission(resourceId: string, userId: string, level: PermissionLevel, teamId?: string) {
    let resourcePerms = this.permissions.get(resourceId) ?? [];
    const permIndex = resourcePerms.findIndex(p => p.userId === userId);
    
    const newPerm = { userId, level, teamId };
    
    if (permIndex > -1) {
      resourcePerms[permIndex] = newPerm;
    } else {
      resourcePerms.push(newPerm);
    }
    
    this.permissions.set(resourceId, resourcePerms);
    
    this.eventSystem.emit('permissionChanged', {
      resourceId,
      userId,
      teamId,
      granted: true,
      level
    });
  }

  revokePermission(resourceId: string, userId: string) {
    const resourcePerms = this.permissions.get(resourceId) ?? [];
    const updatedPerms = resourcePerms.filter(p => p.userId !== userId);
    this.permissions.set(resourceId, updatedPerms);
    
    const revokedPerm = resourcePerms.find(p => p.userId === userId);
    if (revokedPerm) {
      this.eventSystem.emit('permissionChanged', {
        resourceId,
        userId,
        teamId: revokedPerm.teamId,
        granted: false
      });
    }
  }

  getPermissions(resourceId: string): Permission[] {
    return this.permissions.get(resourceId) ?? [];
  }

  private initRoleListener() {
    this.eventSystem.on('roleChanged', (data) => {
      const { userId, teamId, role } = data;
      this.updateTeamPermissions(teamId, userId, role);
    });
  }

  private updateTeamPermissions(teamId: string, userId: string, role: string) {
    const baseLevel = this.getRoleLevelMapping(role);
    if (baseLevel) {
      this.permissions.forEach((perms, resourceId) => {
        const teamPerm = perms.find(p => p.teamId === teamId);
        if (teamPerm) {
          this.setPermission(resourceId, userId, baseLevel, teamId);
        }
      });
    }
  }

  private getRoleLevelMapping(role: string): PermissionLevel | null {
    switch (role) {
      case 'admin': return PermissionLevel.ADMIN;
      case 'editor': return PermissionLevel.WRITE;
      case 'viewer': return PermissionLevel.READ;
      default: return null;
    }
  }
}

export default DrivePerms.getInstance();