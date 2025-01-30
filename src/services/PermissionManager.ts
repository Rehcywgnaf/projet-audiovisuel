import { EventSystem } from '../core/EventSystem';

export enum Permission {
  VIEW = 'VIEW',
  COMMENT = 'COMMENT',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  MANAGE = 'MANAGE',
  OWNER = 'OWNER'
}

export interface PermissionRule {
  id: string;
  entityType: 'USER' | 'GROUP' | 'TEAM';
  entityId: string;
  permission: Permission;
  inherited?: boolean;
  source?: string; // ID de l'entité dont la permission est héritée
}

export interface VersionPermission extends PermissionRule {
  versionId: string;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export class PermissionManager {
  private static instance: PermissionManager;
  private eventSystem: EventSystem;
  private permissions: Map<string, PermissionRule[]>;
  private versionPermissions: Map<string, VersionPermission[]>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.permissions = new Map();
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
    this.eventSystem.on('folderPermissionUpdated', ({ folderId }) => {
      this.propagatePermissions(folderId);
    });

    // Events pour la protection des versions
    this.eventSystem.on('versionCreated', ({ documentId, versionId }) => {
      this.initializeVersionPermissions(documentId, versionId);
    });
  }

  async setPermission(resourceId: string, rule: PermissionRule): Promise<void> {
    const currentRules = this.permissions.get(resourceId) || [];
    
    // Vérification des restrictions de partage
    if (rule.permission === Permission.SHARE) {
      const canShare = await this.canShareResource(resourceId);
      if (!canShare) {
        throw new Error('Sharing restriction: Not allowed to share this resource');
      }
    }

    // Ajout/Mise à jour de la règle
    const updatedRules = [
      ...currentRules.filter(r => !(r.entityId === rule.entityId && r.entityType === rule.entityType)),
      rule
    ];

    this.permissions.set(resourceId, updatedRules);

    // Si c'est un dossier, propager les permissions
    const isFolder = await this.isFolder(resourceId);
    if (isFolder) {
      await this.propagatePermissions(resourceId);
    }

    // Notification du changement
    this.eventSystem.emit('permissionUpdated', { resourceId, rule });
  }

  private async propagatePermissions(folderId: string): Promise<void> {
    const childResources = await this.getChildResources(folderId);
    const folderPermissions = this.permissions.get(folderId) || [];

    for (const child of childResources) {
      const inheritedRules = folderPermissions.map(rule => ({
        ...rule,
        inherited: true,
        source: folderId
      }));

      // Fusionner avec les permissions existantes non héritées
      const currentRules = this.permissions.get(child.id) || [];
      const nonInheritedRules = currentRules.filter(rule => !rule.inherited);

      this.permissions.set(child.id, [
        ...nonInheritedRules,
        ...inheritedRules
      ]);

      // Propager récursivement si c'est un dossier
      if (child.type === 'FOLDER') {
        await this.propagatePermissions(child.id);
      }
    }
  }

  private async initializeVersionPermissions(documentId: string, versionId: string): Promise<void> {
    const docPermissions = this.permissions.get(documentId) || [];
    const versionRules: VersionPermission[] = docPermissions
      .filter(rule => rule.permission === Permission.EDIT || rule.permission === Permission.MANAGE)
      .map(rule => ({
        ...rule,
        versionId,
        canEdit: true,
        canDelete: rule.permission === Permission.MANAGE,
        canShare: rule.permission === Permission.MANAGE
      }));

    this.versionPermissions.set(versionId, versionRules);
  }

  async hasPermission(resourceId: string, entityId: string, permission: Permission): Promise<boolean> {
    const rules = this.permissions.get(resourceId) || [];
    return rules.some(rule => 
      rule.entityId === entityId && 
      (rule.permission === permission || rule.permission === Permission.MANAGE || rule.permission === Permission.OWNER)
    );
  }

  async getResourcePermissions(resourceId: string): Promise<PermissionRule[]> {
    return this.permissions.get(resourceId) || [];
  }

  async getVersionPermissions(versionId: string): Promise<VersionPermission[]> {
    return this.versionPermissions.get(versionId) || [];
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

  private async canShareResource(resourceId: string): Promise<boolean> {
    // À implémenter: vérification des restrictions de partage
    return true; // Pour l'exemple
  }
}