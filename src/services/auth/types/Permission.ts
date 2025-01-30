export enum PermissionLevel {
  NONE = 0,
  READ = 1,
  COMMENT = 2,
  EDIT = 3,
  SHARE = 4,
  MANAGE = 5,
  OWNER = 6
}

export interface Permission {
  level: PermissionLevel;
  inherited?: boolean;
  source?: string;
}

export interface PermissionSet {
  resourceId: string;
  permissions: Permission;
  lastUpdated: number;
}

export type PermissionAction = 'read' | 'write' | 'delete' | 'share' | 'manage';

export interface PermissionRequest {
  resourceId: string;
  action: PermissionAction;
  userId?: string;
}

export interface VersionPermission extends Permission {
  versionId: string;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}