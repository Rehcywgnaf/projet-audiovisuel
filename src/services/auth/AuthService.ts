import { TokenStorage } from './TokenStorage';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export class AuthService {
  private tokenStorage: TokenStorage;
  private static instance: AuthService;

  private constructor() {
    this.tokenStorage = new TokenStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async authenticate(): Promise<string> {
    try {
      const token = await this.tokenStorage.getToken();
      if (token && !this.isTokenExpired(token)) {
        return token;
      }
      return await this.refreshToken();
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Authentication failed');
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(provider);
      const token = await result.user.getIdToken();
      await this.tokenStorage.setToken(token);
      return token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Token refresh failed');
    }
  }

  async logout(): Promise<void> {
    await this.tokenStorage.clearToken();
  }
}
