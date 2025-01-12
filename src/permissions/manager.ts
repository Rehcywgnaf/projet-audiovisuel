import { IPermissions } from './interfaces';

class PermissionsManager {
  private drivePerms: DrivePermissions;
  private teamsPerms: TeamsPermissions;

  constructor() {
    this.drivePerms = new DrivePermissions();
    this.teamsPerms = new TeamsPermissions();
  }

  async checkAccess(userId: string, resourceId: string, action: string): Promise<boolean> {
    const resourceType = this.getResourceType(resourceId);
    return resourceType === 'drive' 
      ? this.drivePerms.checkAccess(userId, resourceId, action)
      : this.teamsPerms.checkAccess(userId, resourceId, action);
  }

  private getResourceType(resourceId: string): 'drive' | 'teams' {
    return resourceId.startsWith('drive_') ? 'drive' : 'teams';
  }
}