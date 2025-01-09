import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { TokenStorage } from './tokenStorage';

interface DriveConfigOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class DriveConfig {
  private static instance: DriveConfig;
  private oauth2Client: OAuth2Client | null = null;
  private drive: any = null;

  private constructor() {}

  static getInstance(): DriveConfig {
    if (!DriveConfig.instance) {
      DriveConfig.instance = new DriveConfig();
    }
    return DriveConfig.instance;
  }

  async initialize(options: DriveConfigOptions): Promise<void> {
    this.oauth2Client = new google.auth.OAuth2(
      options.clientId,
      options.clientSecret,
      options.redirectUri
    );

    const token = TokenStorage.getToken();
    if (token) {
      this.oauth2Client.setCredentials({ access_token: token });
      this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
    }
  }

  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('DriveConfig not initialized');
    }

    return this.oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.readonly'
      ]
    });
  }

  async authenticate(code: string): Promise<void> {
    if (!this.oauth2Client) {
      throw new Error('DriveConfig not initialized');
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    
    if (tokens.access_token) {
      TokenStorage.saveToken(tokens.access_token);
    }

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  logout(): void {
    TokenStorage.clearToken();
    this.oauth2Client = null;
    this.drive = null;
  }

  async listFiles(options: any = {}): Promise<any[]> {
    if (!this.drive) {
      throw new Error('Drive not initialized or not authenticated');
    }

    try {
      const response = await this.drive.files.list({
        pageSize: 30,
        fields: 'files(id, name, mimeType, createdTime, modifiedTime)',
        ...options
      });

      return response.data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
}