interface DriveConfig {
  clientId: string;
  apiKey: string;
  scope: string[];
}

class DriveService {
  private config: DriveConfig;

  constructor(config: DriveConfig) {
    this.config = config;
  }

  async initialiser(): Promise<void> {
    try {
      // Initialisation de l'API Google Drive
      await this.chargerGoogleApi();
    } catch (erreur) {
      console.error('Erreur initialisation Drive:', erreur);
      throw erreur;
    }
  }

  async chargerDocuments(dossier: string) {
    try {
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
      await gapi.client.drive.permissions.create({
        fileId,
        requestBody: {
          role,
          type: 'user',
          emailAddress: email
        }
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