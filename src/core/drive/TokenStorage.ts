export class TokenStorage {
  private static readonly TOKEN_KEY = 'drive_oauth_token';

  static async getStoredToken(): Promise<any | null> {
    try {
      if (typeof window === 'undefined') {
        return null; // Côté serveur
      }
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token) return null;
      return JSON.parse(token);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  static isTokenExpired(token: any): boolean {
    if (!token || !token.expiry_date) return true;
    return Date.now() > token.expiry_date;
  }

  static async storeToken(token: any): Promise<void> {
    try {
      if (typeof window === 'undefined') return; // Côté serveur
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
      throw error;
    }
  }

  static removeToken(): void {
    try {
      if (typeof window === 'undefined') return; // Côté serveur
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  }
}