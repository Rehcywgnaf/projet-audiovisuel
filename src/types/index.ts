export interface PermissionLevel {
  read: boolean;
  write: boolean;
  share: boolean;
  delete: boolean;
}

export interface DrivePermission {
  userId: string;
  resourceId: string;
  level: PermissionLevel;
  teamId?: string;
  expiresAt?: Date;
}

export interface TeamRole {
  userId: string;
  teamId: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface UserAccess {
  userId: string;
  permissions: DrivePermission[];
  teamRoles: TeamRole[];
}