import CryptoJS from 'crypto-js';
import { DriveToken } from '../types';
import { ErrorHandling } from '@/error/ErrorHandling';
import { CacheManager } from '@/cache/CacheManager';

export class TokenStorage {
  private static readonly TOKEN_KEY = 'drive_oauth_token';
  private static readonly ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'default-dev-key';
  private static readonly TOKEN_CACHE_TTL = 3600; // 1 hour
  
  private static errorHandler = ErrorHandling.getInstance();
  private static cacheManager = CacheManager.getInstance();

  static encryptToken(token: DriveToken): string {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(token),
        this.ENCRYPTION_KEY
      ).toString();
    } catch (error) {
      throw this.errorHandler.handleError('TOKEN_ENCRYPTION_ERROR', error);
    }
  }

  static decryptToken(encryptedToken: string): DriveToken | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.ENCRYPTION_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      this.errorHandler.handleError('TOKEN_DECRYPTION_ERROR', error);
      return null;
    }
  }

  static async storeToken(token: DriveToken): Promise<void> {
    try {
      const encryptedToken = this.encryptToken(token);
      localStorage.setItem(this.TOKEN_KEY, encryptedToken);
      
      // Cache the token for quick access
      await this.cacheManager.set(
        `token:${token.access_token}`,
        token,
        this.TOKEN_CACHE_TTL
      );
    } catch (error) {
      throw this.errorHandler.handleError('TOKEN_STORAGE_ERROR', error);
    }
  }

  static async getStoredToken(): Promise<DriveToken | null> {
    try {
      // Check cache first
      const cachedToken = await this.cacheManager.get('token:current');
      if (cachedToken) {
        return cachedToken as DriveToken;
      }

      // If not in cache, check localStorage
      const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
      if (!encryptedToken) return null;

      const token = this.decryptToken(encryptedToken);
      if (token) {
        // Update cache
        await this.cacheManager.set(
          'token:current',
          token,
          this.TOKEN_CACHE_TTL
        );
      }
      return token;
    } catch (error) {
      this.errorHandler.handleError('TOKEN_RETRIEVAL_ERROR', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      await this.cacheManager.delete('token:current');
    } catch (error) {
      throw this.errorHandler.handleError('TOKEN_REMOVAL_ERROR', error);
    }
  }

  static isTokenExpired(token: DriveToken): boolean {
    if (!token || !token.expiry_date) return true;
    // Add a 5-minute margin
    return token.expiry_date < (Date.now() + 5 * 60 * 1000);
  }

  static async refreshAccessToken(newToken: string): Promise<void> {
    try {
      const currentToken = await this.getStoredToken();
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const updatedToken: DriveToken = {
        ...currentToken,
        access_token: newToken,
        expiry_date: Date.now() + (60 * 60 * 1000) // 1 hour from now
      };

      await this.storeToken(updatedToken);
    } catch (error) {
      throw this.errorHandler.handleError('TOKEN_REFRESH_ERROR', error);
    }
  }
}