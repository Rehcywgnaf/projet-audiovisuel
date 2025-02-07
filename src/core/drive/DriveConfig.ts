import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

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

  async authenticateAndGetToken(authCode: string): Promise<any> {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client not initialized');
    }
    try {
      console.log('Getting token from auth code...');
      const { tokens } = await this.oAuth2Client.getToken(authCode);
      console.log('Token received successfully');
      
      this.oAuth2Client.setCredentials(tokens);
      console.log('Credentials set in OAuth2Client');
      
      this.initializeDriveAPI();
      console.log('Drive API initialized');
      
      return tokens;
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

  logout(): void {
    console.log('Logging out...');
    this.oAuth2Client = null;
    this.driveAPI = null;
    console.log('Logout complete');
  }
}