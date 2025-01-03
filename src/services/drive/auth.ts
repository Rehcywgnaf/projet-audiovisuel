import { OAuth2Client } from 'google-auth-library';

interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

class DriveAuthService {
  private static instance: DriveAuthService;
  private oAuth2Client: OAuth2Client | null = null;
  private readonly scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ];

  private constructor() {}

  static getInstance(): DriveAuthService {
    if (!DriveAuthService.instance) {
      DriveAuthService.instance = new DriveAuthService();
    }
    return DriveAuthService.instance;
  }

  initialize(config: AuthConfig) {
    this.oAuth2Client = new OAuth2Client(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
  }

  getAuthUrl(): string {
    if (!this.oAuth2Client) {
      throw new Error('OAuth client not initialized');
    }

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent'
    });
  }

  async getTokenFromCode(code: string) {
    if (!this.oAuth2Client) {
      throw new Error('OAuth client not initialized');
    }

    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    return tokens;
  }

  async refreshToken(refreshToken: string) {
    if (!this.oAuth2Client) {
      throw new Error('OAuth client not initialized');
    }

    this.oAuth2Client.setCredentials({
      refresh_token: refreshToken
    });

    const { credentials } = await this.oAuth2Client.refreshAccessToken();
    return credentials;
  }

  isAuthenticated(): boolean {
    return !!this.oAuth2Client?.credentials.access_token;
  }
}

export const driveAuthService = DriveAuthService.getInstance();
export type { AuthConfig };