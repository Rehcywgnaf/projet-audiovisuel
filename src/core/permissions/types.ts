export enum PermissionLevel {
  NONE = 0,
  READ = 1,
  COMMENT = 2,
  EDIT = 3,
  SHARE = 4,
  MANAGE = 5,
  OWNER = 6
}

export interface BasePermission {
  level: PermissionLevel;
  userId: string;
  teamId?: string;
  inherited?: boolean;
  source?: string;
}

// Pour les fichiers
export interface FilePermission extends BasePermission {
  type: 'file';
  fileId: string;
  allowVersioning?: boolean;
}

// Pour l'authentification
export interface AuthPermission extends BasePermission {
  type: 'auth';
  resourceId: string;
  expiresAt?: number;
}

// Pour les templates
export interface TemplatePermission extends BasePermission {
  type: 'template';
  templateId: string;
  canEdit: boolean;
  canShare: boolean;
}

export type Permission = FilePermission | AuthPermission | TemplatePermission;

export type PermissionAction = 'read' | 'write' | 'delete' | 'share' | 'manage';

export interface PermissionRequest {
  type: Permission['type'];
  resourceId: string;
  action: PermissionAction;
  userId: string;
  teamId?: string;
}