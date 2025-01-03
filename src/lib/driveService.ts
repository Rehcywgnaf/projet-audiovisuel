interface DrivePermission {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  type: 'user' | 'group';
  folder: string;
  addedOn: string;
  inherited?: boolean;
  parentFolder?: string;
}

class DriveService {
  private static instance: DriveService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): DriveService {
    if (!DriveService.instance) {
      DriveService.instance = new DriveService();
    }
    return DriveService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.initialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du service Drive:', error);
      throw error;
    }
  }

  public async addPermission(email: string, role: string, folderId: string): Promise<DrivePermission> {
    try {
      return {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role: role as 'viewer' | 'editor' | 'owner',
        type: 'user',
        folder: folderId,
        addedOn: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la permission:', error);
      throw error;
    }
  }

  public async removePermission(permissionId: string, folderId: string): Promise<void> {
    try {
      console.log('Permission supprimée:', permissionId);
    } catch (error) {
      console.error('Erreur lors de la suppression de la permission:', error);
      throw error;
    }
  }

  public async getFolderPermissions(folderId: string): Promise<DrivePermission[]> {
    try {
      return [
        {
          id: '1',
          email: 'production@example.com',
          role: 'editor',
          type: 'user',
          folder: folderId,
          addedOn: new Date().toISOString()
        },
        {
          id: '2',
          email: 'technique@example.com',
          role: 'viewer',
          type: 'user',
          folder: folderId,
          addedOn: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    } catch (error) {
      console.error('Erreur lors de la récupération des permissions:', error);
      throw error;
    }
  }

  public async getInheritedPermissions(folderId: string): Promise<DrivePermission[]> {
    try {
      const parentFolder = await this.getParentFolder(folderId);
      if (!parentFolder) return [];

      return [{
        id: '3',
        email: 'admin@example.com',
        role: 'owner',
        type: 'user',
        folder: parentFolder.id,
        addedOn: new Date().toISOString(),
        inherited: true,
        parentFolder: parentFolder.name
      }];
    } catch (error) {
      console.error('Erreur lors de la récupération des permissions héritées:', error);
      throw error;
    }
  }

  private async getParentFolder(folderId: string): Promise<{ id: string, name: string } | null> {
    try {
      return {
        id: 'parent-folder-id',
        name: 'Dossier Parent'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier parent:', error);
      return null;
    }
  }
}

export const driveService = DriveService.getInstance();
export type { DrivePermission };