import { TokenStorage } from './tokenStorage';
import { OAuth2Client } from 'google-auth-library';

interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export class AuthService {
  private static instance: AuthService;
  private oAuth2Client: OAuth2Client | null = null;
  private config: AuthConfig | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  initialize(config: AuthConfig): void {
    this.config = config;
    this.oAuth2Client = new OAuth2Client(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
    
    const storedToken = TokenStorage.getStoredToken();
    if (storedToken && !TokenStorage.isTokenExpired(storedToken)) {
      this.oAuth2Client.setCredentials(storedToken);
    }
  }

  getAuthUrl(): string {
    if (!this.oAuth2Client || !this.config) {
      throw new Error('AuthService non initialisé');
    }

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scopes,
      prompt: 'consent'
    });
  }

  async authenticate(code: string): Promise<void> {
    if (!this.oAuth2Client) {
      throw new Error('AuthService non initialisé');
    }

    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    TokenStorage.storeToken(tokens);
  }

  async refreshToken(): Promise<void> {
    if (!this.oAuth2Client?.credentials.refresh_token) {
      throw new Error('Pas de refresh token disponible');
    }

    const { credentials } = await this.oAuth2Client.refreshAccessToken();
    TokenStorage.storeToken(credentials);
  }

  logout(): void {
    TokenStorage.removeToken();
    this.oAuth2Client?.revokeCredentials();
  }

  isAuthenticated(): boolean {
    if (!this.oAuth2Client?.credentials) return false;
    return !TokenStorage.isTokenExpired(this.oAuth2Client.credentials);
  }

  getClient(): OAuth2Client | null {
    return this.oAuth2Client;
  }
}