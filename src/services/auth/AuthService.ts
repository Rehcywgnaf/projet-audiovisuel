import { TokenStorage } from './TokenStorage';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthState, AuthToken, AuthError, AuthOptions } from './types/Auth';

export class AuthService {
  private tokenStorage: TokenStorage;
  private static instance: AuthService;
  private state: AuthState;
  private refreshTimer: number | null;
  private options: Required<AuthOptions>;

  private static readonly DEFAULT_OPTIONS: Required<AuthOptions> = {
    autoRefresh: true,
    refreshThreshold: 5, // minutes
    maxRetries: 3
  };

  private constructor(options: AuthOptions = {}) {
    this.tokenStorage = new TokenStorage();
    this.options = { ...AuthService.DEFAULT_OPTIONS, ...options };
    this.state = {
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastRefresh: null
    };
    this.refreshTimer = null;
  }

  public static getInstance(options?: AuthOptions): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(options);
    }
    return AuthService.instance;
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  async authenticate(retryCount = 0): Promise<string> {
    try {
      this.setState({ isLoading: true, error: null });

      const storedToken = await this.tokenStorage.getToken();
      if (storedToken && !this.isNearExpiry(storedToken)) {
        this.setAuthenticated(true);
        this.setupAutoRefresh(storedToken);
        return storedToken.token;
      }

      return await this.refreshToken(retryCount);
    } catch (error) {
      this.handleAuthError(error as AuthError);
      throw error;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private isNearExpiry(token: AuthToken): boolean {
    const threshold = this.options.refreshThreshold * 60 * 1000;
    return token.expiresAt - Date.now() <= threshold;
  }

  async refreshToken(retryCount = 0): Promise<string> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(provider);
      const token = await result.user.getIdToken();
      
      const authToken: AuthToken = {
        token,
        refreshToken: await result.user.getIdToken(true),
        expiresAt: Date.now() + 3600000,
        type: 'default'
      };

      await this.tokenStorage.setToken(authToken);
      this.setAuthenticated(true);
      this.setupAutoRefresh(authToken);
      
      return token;
    } catch (error) {
      if (retryCount < this.options.maxRetries) {
        return this.refreshToken(retryCount + 1);
      }
      this.handleAuthError('AUTH_INVALID_TOKEN');
      throw new Error('Token refresh failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.tokenStorage.clearAllTokens();
      this.clearAutoRefresh();
      this.setAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  }

  private setupAutoRefresh(token: AuthToken): void {
    if (!this.options.autoRefresh) return;

    this.clearAutoRefresh();
    
    const timeToRefresh = token.expiresAt - Date.now() - 
      (this.options.refreshThreshold * 60 * 1000);

    this.refreshTimer = window.setTimeout(
      () => this.refreshToken(),
      timeToRefresh
    );
  }

  private clearAutoRefresh(): void {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private setState(partial: Partial<AuthState>): void {
    this.state = { ...this.state, ...partial };
  }

  private setAuthenticated(isAuthenticated: boolean): void {
    this.setState({
      isAuthenticated,
      lastRefresh: isAuthenticated ? Date.now() : null
    });
  }

  private handleAuthError(error: AuthError): void {
    this.setAuthenticated(false);
    this.setState({ error: error });
  }
}