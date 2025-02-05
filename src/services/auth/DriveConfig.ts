import { google } from 'googleapis';

interface DriveConfigOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class DriveConfig {
  private static instance: DriveConfig;
  private clientId: string = '';
  private clientSecret: string = '';
  private redirectUri: string = '';
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): DriveConfig {
    if (!DriveConfig.instance) {
      DriveConfig.instance = new DriveConfig();
    }
    return DriveConfig.instance;
  }

  async initialize(options: DriveConfigOptions): Promise<void> {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
  }

  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ];

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async authenticate(code: string): Promise<void> {
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Erreur d\'authentification');
      }

      const tokenData = await tokenResponse.json();
      this.accessToken = tokenData.access_token;
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      throw error;
    }
  }

  logout(): void {
    this.accessToken = null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export default DriveConfig.getInstance();