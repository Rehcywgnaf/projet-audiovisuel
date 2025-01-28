export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface PermissionSet {
  resourceId: string;
  permissions: Permission;
  lastUpdated: number;
}

export type PermissionAction = keyof Permission;

export interface PermissionRequest {
  resourceId: string;
  action: PermissionAction;
  userId?: string;
}