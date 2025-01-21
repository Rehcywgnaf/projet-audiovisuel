import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { TokenStorage } from './tokenStorage';
import { DriveConfigOptions } from '../types';
import { ErrorHandling } from '@/error/ErrorHandling';

export class DriveConfig {
  private static instance: DriveConfig;
  private oAuth2Client: OAuth2Client | null = null;
  private drive: any | null = null;
  private errorHandler: ErrorHandling;

  private constructor() {
    this.errorHandler = ErrorHandling.getInstance();
  }

  static getInstance(): DriveConfig {
    if (!DriveConfig.instance) {
      DriveConfig.instance = new DriveConfig();
    }
    return DriveConfig.instance;
  }

  async initialize(options: DriveConfigOptions): Promise<void> {
    try {
      this.oAuth2Client = new google.auth.OAuth2(
        options.clientId,
        options.clientSecret,
        options.redirectUri
      );
      
      const token = await this.getStoredToken();
      if (token) {
        if (TokenStorage.isTokenExpired(token)) {
          await this.refreshTokenIfNeeded();
        } else {
          this.oAuth2Client.setCredentials(token);
          this.initializeDriveAPI();
        }
      }
    } catch (error) {
      throw this.errorHandler.handleError('DRIVE_INIT_ERROR', error);
    }
  }

  async authenticate(authCode: string): Promise<void> {
    if (!this.oAuth2Client) {
      throw this.errorHandler.handleError('DRIVE_NOT_INITIALIZED');
    }

    try {
      const { tokens } = await this.oAuth2Client.getToken(authCode);
      this.oAuth2Client.setCredentials(tokens);
      await this.storeToken(tokens);
      this.initializeDriveAPI();
    } catch (error) {
      throw this.errorHandler.handleError('DRIVE_AUTH_ERROR', error);
    }
  }

  getDriveAPI(): any {
    if (!this.drive) {
      throw this.errorHandler.handleError('DRIVE_NOT_INITIALIZED');
    }
    return this.drive;
  }

  getAuthUrl(): string {
    if (!this.oAuth2Client) {
      throw this.errorHandler.handleError('DRIVE_NOT_INITIALIZED');
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

  private initializeDriveAPI(): void {
    if (!this.oAuth2Client) {
      throw this.errorHandler.handleError('DRIVE_NOT_INITIALIZED');
    }

    this.drive = google.drive({
      version: 'v3',
      auth: this.oAuth2Client
    });
  }

  private async getStoredToken(): Promise<any> {
    try {
      return TokenStorage.getStoredToken();
    } catch (error) {
      return null;
    }
  }

  private async storeToken(tokens: any): Promise<void> {
    try {
      await TokenStorage.storeToken(tokens);
    } catch (error) {
      throw this.errorHandler.handleError('TOKEN_STORAGE_ERROR', error);
    }
  }

  async refreshTokenIfNeeded(): Promise<void> {
    if (!this.oAuth2Client) {
      throw this.errorHandler.handleError('DRIVE_NOT_INITIALIZED');
    }

    const credentials = this.oAuth2Client.credentials;
    if (!credentials.refresh_token) {
      throw this.errorHandler.handleError('REFRESH_TOKEN_NOT_AVAILABLE');
    }

    try {
      const { credentials: newCredentials } = await this.oAuth2Client.refreshToken(
        credentials.refresh_token as string
      );
      this.oAuth2Client.setCredentials(newCredentials);
      await this.storeToken(newCredentials);
    } catch (error) {
      throw this.errorHandler.handleError('TOKEN_REFRESH_ERROR', error);
    }
  }

  async listFiles(options: any = {}): Promise<any[]> {
    if (!this.drive) {
      throw this.errorHandler.handleError('DRIVE_NOT_INITIALIZED');
    }

    try {
      const response = await this.drive.files.list({
        pageSize: 30,
        fields: 'files(id, name, mimeType, createdTime, modifiedTime)',
        ...options
      });

      return response.data.files;
    } catch (error) {
      throw this.errorHandler.handleError('FILE_LIST_ERROR', error);
    }
  }

  logout(): void {
    TokenStorage.removeToken();
    this.oAuth2Client = null;
    this.drive = null;
  }
}