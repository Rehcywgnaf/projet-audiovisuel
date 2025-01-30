import { EventSystem } from '../core/EventSystem';
import { PermissionService } from './auth/permissionService';
import { PermissionLevel } from '../types';

export interface VersionPermission {
  resourceId: string;
  versionId: string;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export class PermissionManager {
  private static instance: PermissionManager;
  private eventSystem: EventSystem;
  private permissionService: PermissionService;
  private versionPermissions: Map<string, VersionPermission[]>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.permissionService = PermissionService.getInstance();
    this.versionPermissions = new Map();
    this.initializeEventListeners();
  }

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  private initializeEventListeners(): void {
    // Events pour la gestion des héritages
    this.eventSystem.on('folderPermissionUpdated', async ({ folderId, userId }) => {
      await this.propagatePermissions(folderId, userId);
    });

    // Events pour la protection des versions
    this.eventSystem.on('versionCreated', async ({ documentId, versionId, userId }) => {
      await this.initializeVersionPermissions(documentId, versionId, userId);
    });
  }

  async setPermission(resourceId: string, userId: string, level: PermissionLevel, teamId?: string): Promise<void> {
    // Vérification des restrictions de partage
    if (level === PermissionLevel.SHARE) {
      const canShare = await this.canShareResource(resourceId, userId);
      if (!canShare) {
        throw new Error('Sharing restriction: Not allowed to share this resource');
      }
    }

    // Utilisation du permissionService existant
    await this.permissionService.setPermission(resourceId, userId, level, teamId);

    // Si c'est un dossier, propager les permissions
    const isFolder = await this.isFolder(resourceId);
    if (isFolder) {
      await this.propagatePermissions(resourceId, userId);
    }
  }

  private async propagatePermissions(folderId: string, userId: string): Promise<void> {
    const childResources = await this.getChildResources(folderId);
    const parentPermissions = await this.permissionService.getPermissions(folderId);

    for (const child of childResources) {
      for (const permission of parentPermissions) {
        if (permission.userId === userId) {
          await this.permissionService.setPermission(
            child.id,
            userId,
            permission.level,
            permission.teamId
          );

          // Propager récursivement si c'est un dossier
          if (child.type === 'FOLDER') {
            await this.propagatePermissions(child.id, userId);
          }
        }
      }
    }
  }

  private async initializeVersionPermissions(
    documentId: string, 
    versionId: string,
    userId: string
  ): Promise<void> {
    // Vérifier les permissions sur le document
    const permissions = await this.permissionService.getUserPermissions(userId);
    const docPermission = permissions.find(p => p.resourceId === documentId);

    if (docPermission) {
      const versionRule: VersionPermission = {
        resourceId: documentId,
        versionId,
        canEdit: docPermission.level >= PermissionLevel.EDIT,
        canDelete: docPermission.level >= PermissionLevel.MANAGE,
        canShare: docPermission.level >= PermissionLevel.SHARE
      };

      const existingRules = this.versionPermissions.get(versionId) || [];
      this.versionPermissions.set(versionId, [...existingRules, versionRule]);
    }
  }

  async checkVersionPermission(versionId: string, userId: string, action: 'edit' | 'delete' | 'share'): Promise<boolean> {
    const rules = this.versionPermissions.get(versionId) || [];
    const rule = rules.find(r => r.resourceId === versionId);
    
    if (!rule) return false;

    switch (action) {
      case 'edit': return rule.canEdit;
      case 'delete': return rule.canDelete;
      case 'share': return rule.canShare;
      default: return false;
    }
  }

  // Méthodes utilitaires privées
  private async isFolder(resourceId: string): Promise<boolean> {
    // À implémenter: vérification du type de ressource
    return true; // Pour l'exemple
  }

  private async getChildResources(folderId: string): Promise<Array<{id: string, type: 'FILE' | 'FOLDER'}>> {
    // À implémenter: récupération des ressources enfants
    return []; // Pour l'exemple
  }

  private async canShareResource(resourceId: string, userId: string): Promise<boolean> {
    // Vérifier si l'utilisateur a les permissions nécessaires pour partager
    return await this.permissionService.checkPermission(
      resourceId,
      userId,
      PermissionLevel.SHARE
    );
  }
}