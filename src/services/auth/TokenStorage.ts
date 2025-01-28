import { AuthToken } from './types/Auth';
import { encrypt, decrypt } from './utils/encryption';

export class TokenStorage {
  private readonly STORAGE_PREFIX = 'auth_token_';
  private readonly TOKEN_LIST_KEY = 'auth_tokens';

  constructor(private readonly storage: Storage = localStorage) {}

  async getToken(type: string = 'default'): Promise<AuthToken | null> {
    try {
      const key = this.getStorageKey(type);
      const encryptedData = this.storage.getItem(key);
      
      if (!encryptedData) return null;
      
      const token = JSON.parse(decrypt(encryptedData)) as AuthToken;
      
      if (this.isTokenExpired(token)) {
        await this.removeToken(type);
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setToken(token: AuthToken, type: string = 'default'): Promise<void> {
    try {
      const key = this.getStorageKey(type);
      const encryptedData = encrypt(JSON.stringify(token));
      
      this.storage.setItem(key, encryptedData);
      await this.addToTokenList(type);
    } catch (error) {
      console.error('Error setting token:', error);
      throw new Error('Failed to store token');
    }
  }

  async clearToken(type: string = 'default'): Promise<void> {
    try {
      const key = this.getStorageKey(type);
      this.storage.removeItem(key);
      await this.removeFromTokenList(type);
    } catch (error) {
      console.error('Error clearing token:', error);
      throw new Error('Failed to clear token');
    }
  }

  async clearAllTokens(): Promise<void> {
    try {
      const tokens = await this.getTokenList();
      await Promise.all(tokens.map(type => this.clearToken(type)));
      this.storage.removeItem(this.TOKEN_LIST_KEY);
    } catch (error) {
      console.error('Error clearing all tokens:', error);
      throw new Error('Failed to clear all tokens');
    }
  }

  async rotateToken(type: string = 'default'): Promise<void> {
    const token = await this.getToken(type);
    if (!token) return;

    const newToken: AuthToken = {
      ...token,
      expiresAt: Date.now() + 3600000 // 1 hour
    };

    await this.setToken(newToken, type);
  }

  private getStorageKey(type: string): string {
    return `${this.STORAGE_PREFIX}${type}`;
  }

  private isTokenExpired(token: AuthToken): boolean {
    return token.expiresAt < Date.now();
  }

  private async getTokenList(): Promise<string[]> {
    try {
      const list = this.storage.getItem(this.TOKEN_LIST_KEY);
      return list ? JSON.parse(decrypt(list)) : [];
    } catch {
      return [];
    }
  }

  private async addToTokenList(type: string): Promise<void> {
    const tokens = await this.getTokenList();
    if (!tokens.includes(type)) {
      tokens.push(type);
      this.storage.setItem(
        this.TOKEN_LIST_KEY,
        encrypt(JSON.stringify(tokens))
      );
    }
  }

  private async removeFromTokenList(type: string): Promise<void> {
    const tokens = await this.getTokenList();
    const newList = tokens.filter(t => t !== type);
    this.storage.setItem(
      this.TOKEN_LIST_KEY,
      encrypt(JSON.stringify(newList))
    );
  }
}