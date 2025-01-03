import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class DriveConfig {
  private static instance: DriveConfig;
  private oAuth2Client: OAuth2Client | null = null;
  private drive: any | null = null;

  private constructor() {}

  static getInstance(): DriveConfig {
    if (!DriveConfig.instance) {
      DriveConfig.instance = new DriveConfig();
    }
    return DriveConfig.instance;
  }

  async initialize(credentials: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }): Promise<void> {
    try {
      this.oAuth2Client = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUri
      );

      const token = await this.getStoredToken();
      if (token) {
        this.oAuth2Client.setCredentials(token);
        this.initializeDriveAPI();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Drive:', error);
      throw new Error('Échec de l\'initialisation de Drive');
    }
  }

  async authenticate(authCode: string): Promise<void> {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client non initialisé');
    }

    try {
      const { tokens } = await this.oAuth2Client.getToken(authCode);
      this.oAuth2Client.setCredentials(tokens);
      await this.storeToken(tokens);
      this.initializeDriveAPI();
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      throw new Error('Échec de l\'authentification');
    }
  }

  getDriveAPI(): any {
    if (!this.drive) {
      throw new Error('API Drive non initialisée');
    }
    return this.drive;
  }

  getAuthUrl(): string {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client non initialisé');
    }

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata'
      ]
    });
  }

  private initializeDriveAPI(): void {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client non initialisé');
    }

    this.drive = google.drive({
      version: 'v3',
      auth: this.oAuth2Client
    });
  }

  private async getStoredToken(): Promise<any> {
    try {
      return null;
    } catch (error) {
      console.warn('Pas de token stocké trouvé');
      return null;
    }
  }

  private async storeToken(tokens: any): Promise<void> {
    try {
      // TODO: Implémenter le stockage sécurisé du token
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
      throw error;
    }
  }

  async refreshTokenIfNeeded(): Promise<void> {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client non initialisé');
    }

    const credentials = this.oAuth2Client.credentials;
    if (!credentials.expiry_date || credentials.expiry_date < Date.now() + 5 * 60 * 1000) {
      try {
        const { credentials: newCredentials } = await this.oAuth2Client.refreshToken(
          credentials.refresh_token as string
        );
        this.oAuth2Client.setCredentials(newCredentials);
        await this.storeToken(newCredentials);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        throw error;
      }
    }
  }
}