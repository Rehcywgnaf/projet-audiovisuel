import { google } from 'googleapis';

interface DriveConfigOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class DriveConfig {
  private static instance: DriveConfig;
  private clientId: string = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  private clientSecret: string = process.env.GOOGLE_CLIENT_SECRET || '';
  private redirectUri: string = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '';
  private accessToken: string | null = null;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): DriveConfig {
    if (!DriveConfig.instance) {
      DriveConfig.instance = new DriveConfig();
    }
    return DriveConfig.instance;
  }

  async initialize(options?: DriveConfigOptions): Promise<void> {
    if (options) {
      this.clientId = options.clientId;
      this.clientSecret = options.clientSecret;
      this.redirectUri = options.redirectUri;
    }

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('Client configuration is missing or incomplete');
    }

    this.initialized = true;
  }

  private checkInitialized() {
    if (!this.initialized) {
      throw new Error('DriveConfig not initialized. Call initialize() first.');
    }
  }

  getAuthUrl(): string {
    this.checkInitialized();

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
    this.checkInitialized();

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
        throw new Error('Authentication error');
      }

      const tokenData = await tokenResponse.json();
      this.accessToken = tokenData.access_token;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  logout(): void {
    this.accessToken = null;
  }

  getAccessToken(): string | null {
    this.checkInitialized();
    return this.accessToken;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Initialise l'instance avec les valeurs par défaut
const instance = DriveConfig.getInstance();
if (!instance.isInitialized()) {
  instance.initialize().catch(console.error);
}

export default instance;