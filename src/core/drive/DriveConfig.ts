import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { TokenStorage } from './TokenStorage';

export class DriveConfig {
  private static instance: DriveConfig;
  private oAuth2Client: OAuth2Client | null = null;
  private driveAPI: drive_v3.Drive | null = null;

  private constructor() {}

  public static getInstance(): DriveConfig {
    if (!DriveConfig.instance) {
      DriveConfig.instance = new DriveConfig();
    }
    return DriveConfig.instance;
  }

  async initialize(credentials: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }, checkToken: boolean = true): Promise<void> {
    try {
      if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
        throw new Error('Credentials missing or incomplete');
      }

      this.oAuth2Client = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUri
      );
      
      if (checkToken) {
        const token = await TokenStorage.getStoredToken();
        if (token) {
          if (TokenStorage.isTokenExpired(token)) {
            await this.refreshTokenIfNeeded();
          } else {
            this.oAuth2Client.setCredentials(token);
            this.initializeDriveAPI();
          }
        }
      }
    } catch (error) {
      console.error('Error initializing Drive:', error);
      throw error;
    }
  }

  getAuthUrl(): string {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client not initialized');
    }
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata'
      ],
      prompt: 'consent'
    });
  }

  async authenticate(authCode: string): Promise<void> {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client not initialized');
    }
    try {
      const { tokens } = await this.oAuth2Client.getToken(authCode);
      this.oAuth2Client.setCredentials(tokens);
      await TokenStorage.storeToken(tokens);
      this.initializeDriveAPI();
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  getDriveAPI(): drive_v3.Drive {
    if (!this.driveAPI) {
      throw new Error('Drive API not initialized');
    }
    return this.driveAPI;
  }

  private initializeDriveAPI(): void {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client not initialized');
    }
    this.driveAPI = google.drive({
      version: 'v3',
      auth: this.oAuth2Client
    });
  }

  async refreshTokenIfNeeded(): Promise<void> {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client not initialized');
    }
    const credentials = this.oAuth2Client.credentials;
    
    if (!credentials.refresh_token) {
      throw new Error('Refresh token not available');
    }

    try {
      const { credentials: newCredentials } = await this.oAuth2Client.refreshToken(
        credentials.refresh_token as string
      );
      this.oAuth2Client.setCredentials(newCredentials);
      await TokenStorage.storeToken(newCredentials);
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  logout(): void {
    TokenStorage.removeToken();
    this.oAuth2Client = null;
    this.driveAPI = null;
  }
}