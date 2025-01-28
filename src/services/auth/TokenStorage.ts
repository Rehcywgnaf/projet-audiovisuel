export class TokenStorage {
  private readonly TOKEN_KEY = 'auth_token';

  async getToken(): Promise<string | null> {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw new Error('Failed to store token');
    }
  }

  async clearToken(): Promise<void> {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing token:', error);
      throw new Error('Failed to clear token');
    }
  }
}
