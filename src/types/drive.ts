// Types communs
export type ResourceId = string;
export type UserId = string;

// Types DriveCore
export interface DriveOperation {
  type: 'create' | 'read' | 'update' | 'delete';
  resourceId?: ResourceId;
  payload?: any;
}

// Types DriveSync
export type SyncStatus = 'synced' | 'pending' | 'error' | 'unknown';

export interface SyncOperation extends DriveOperation {
  fileId: string;
  timestamp: Date;
  retryCount?: number;
}

// Types DrivePerms
export enum PermissionLevel {
  READ = 1,
  WRITE = 2,
  ADMIN = 3
}

export interface Permission {
  userId: UserId;
  resourceId: ResourceId;
  level: PermissionLevel;
  grantedAt: Date;
  grantedBy: UserId;
}

export interface AccessAudit {
  timestamp: Date;
  action: 'set_permission' | 'revoke_permission' | 'check_permission';
  userId: UserId;
  resourceId: ResourceId;
  level?: PermissionLevel;
}