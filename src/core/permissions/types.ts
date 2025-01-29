/**
 * Types pour la gestion des permissions
 */

export type PermissionRole = 'reader' | 'writer' | 'owner';
export type PermissionOperation = 'read' | 'write' | 'delete';

export interface Permission {
  fileId: string;
  role: PermissionRole;
  type: 'user' | 'group' | 'domain' | 'anyone';
  emailAddress?: string;
  domain?: string;
}

export interface PermissionRequest {
  fileId: string;
  operation: PermissionOperation;
  userId?: string;
}