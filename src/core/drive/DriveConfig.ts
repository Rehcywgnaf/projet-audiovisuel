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
      console.log('Initializing DriveConfig with credentials:', {
        hasClientId: !!credentials.clientId,
        hasClientSecret: !!credentials.clientSecret,
        redirectUri: credentials.redirectUri
      });

      if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
        throw new Error('Credentials missing or incomplete');
      }

      this.oAuth2Client = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUri
      );
      
      console.log('OAuth2Client initialized successfully');
      
      if (checkToken) {
        console.log('Checking existing token...');
        const token = await TokenStorage.getStoredToken();
        if (token) {
          console.log('Token found in storage');
          if (TokenStorage.isTokenExpired(token)) {
            console.log('Token expired, refreshing...');
            await this.refreshTokenIfNeeded();
          } else {
            console.log('Token valid, setting credentials');
            this.oAuth2Client.setCredentials(token);
            this.initializeDriveAPI();
          }
        } else {
          console.log('No token found in storage');
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

    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata'
    ];

    console.log('Generating auth URL with scopes:', scopes);
    console.log('Current redirect URI:', this.oAuth2Client.redirectUri);

    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      include_granted_scopes: true
    });

    console.log('Generated auth URL:', url);
    return url;
  }

  async authenticate(authCode: string): Promise<void> {
    console.log('Starting authentication with code');
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client not initialized');
    }
    try {
      console.log('Getting token from auth code...');
      const { tokens } = await this.oAuth2Client.getToken(authCode);
      console.log('Token received successfully');
      
      this.oAuth2Client.setCredentials(tokens);
      console.log('Credentials set in OAuth2Client');
      
      await TokenStorage.storeToken(tokens);
      console.log('Token stored successfully');
      
      this.initializeDriveAPI();
      console.log('Drive API initialized');
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
    console.log('Initializing Drive API');
    this.driveAPI = google.drive({
      version: 'v3',
      auth: this.oAuth2Client
    });
    console.log('Drive API initialized successfully');
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
      console.log('Refreshing token...');
      const { credentials: newCredentials } = await this.oAuth2Client.refreshToken(
        credentials.refresh_token as string
      );
      this.oAuth2Client.setCredentials(newCredentials);
      await TokenStorage.storeToken(newCredentials);
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  logout(): void {
    console.log('Logging out...');
    TokenStorage.removeToken();
    this.oAuth2Client = null;
    this.driveAPI = null;
    console.log('Logout complete');
  }
}