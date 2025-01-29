import { Permission, PermissionRequest, PermissionRole, PermissionOperation } from './types';
import { EventSystem } from '../../core/EventSystem';

/**
 * Gestionnaire centralisé des permissions
 * Implémente le pattern Singleton pour une gestion unifiée
 */
class PermissionManager {
  private static instance: PermissionManager;
  private eventSystem: EventSystem;
  private permissions: Map<string, Permission[]>;
  private roleHierarchy: Map<PermissionRole, number>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.permissions = new Map();
    this.roleHierarchy = new Map([
      ['reader', 1],
      ['writer', 2],
      ['owner', 3]
    ]);
    this.initializeEventListeners();
  }

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  private initializeEventListeners(): void {
    this.eventSystem.on('filePermissionsUpdated', ({ fileId }) => {
      this.invalidatePermissions(fileId);
    });
  }

  /**
   * Vérifie si une opération est autorisée
   */
  async checkPermission(request: PermissionRequest): Promise<boolean> {
    const filePerms = await this.getFilePermissions(request.fileId);
    if (!filePerms?.length) return false;

    // Pour l'instant, on vérifie juste le rôle minimal requis
    const minRole = this.getMinimalRoleForOperation(request.operation);
    return filePerms.some(perm => 
      this.roleHierarchy.get(perm.role) >= this.roleHierarchy.get(minRole)
    );
  }

  /**
   * Ajoute une nouvelle permission
   */
  async addPermission(permission: Permission): Promise<void> {
    const existing = this.permissions.get(permission.fileId) || [];
    this.permissions.set(permission.fileId, [...existing, permission]);
    
    this.eventSystem.emit('filePermissionsUpdated', { 
      fileId: permission.fileId 
    });
  }

  /**
   * Récupère les permissions d'un fichier
   */
  async getFilePermissions(fileId: string): Promise<Permission[]> {
    return this.permissions.get(fileId) || [];
  }

  /**
   * Invalide les permissions en cache pour un fichier
   */
  private invalidatePermissions(fileId: string): void {
    this.permissions.delete(fileId);
  }

  /**
   * Détermine le rôle minimal requis pour une opération
   */
  private getMinimalRoleForOperation(operation: PermissionOperation): PermissionRole {
    switch (operation) {
      case 'read':
        return 'reader';
      case 'write':
        return 'writer';
      case 'delete':
        return 'owner';
      default:
        return 'owner';
    }
  }

  /**
   * Supprime une permission
   */
  async removePermission(fileId: string, emailAddress: string): Promise<void> {
    const existing = this.permissions.get(fileId) || [];
    const updated = existing.filter(p => p.emailAddress !== emailAddress);
    
    if (updated.length !== existing.length) {
      this.permissions.set(fileId, updated);
      this.eventSystem.emit('filePermissionsUpdated', { fileId });
    }
  }
}

export default PermissionManager;