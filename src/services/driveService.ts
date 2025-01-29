import PermissionManager from '../core/permissions/PermissionManager';

interface DriveConfig {
  clientId: string;
  apiKey: string;
  scope: string[];
}

class DriveService {
  private config: DriveConfig;
  private permissionManager: PermissionManager;

  constructor(config: DriveConfig) {
    this.config = config;
    this.permissionManager = PermissionManager.getInstance();
  }

  async initialiser(): Promise<void> {
    try {
      await this.chargerGoogleApi();
    } catch (erreur) {
      console.error('Erreur initialisation Drive:', erreur);
      throw erreur;
    }
  }

  async chargerDocuments(dossier: string) {
    try {
      // Vérifier les permissions avant de charger
      await this.permissionManager.checkPermission({
        fileId: dossier,
        operation: 'read'
      });

      const response = await gapi.client.drive.files.list({
        q: `'${dossier}' in parents`,
        fields: 'files(id, name, mimeType, modifiedTime)'
      });
      return response.result.files;
    } catch (erreur) {
      console.error('Erreur chargement documents:', erreur);
      throw erreur;
    }
  }

  async mettreAJourPermissions(fileId: string, email: string, role: string) {
    try {
      // Vérifier que l'utilisateur a les droits pour modifier les permissions
      await this.permissionManager.checkPermission({
        fileId,
        operation: 'write'
      });

      // Créer la permission dans Drive
      await gapi.client.drive.permissions.create({
        fileId,
        requestBody: {
          role,
          type: 'user',
          emailAddress: email
        }
      });

      // Ajouter la permission dans notre gestionnaire
      await this.permissionManager.addPermission({
        fileId,
        role: role as any,
        type: 'user',
        emailAddress: email
      });
    } catch (erreur) {
      console.error('Erreur mise à jour permissions:', erreur);
      throw erreur;
    }
  }

  private async chargerGoogleApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: this.config.apiKey,
            clientId: this.config.clientId,
            scope: this.config.scope.join(' ')
          });
          resolve();
        } catch (erreur) {
          reject(erreur);
        }
      });
    });
  }
}

export default DriveService;