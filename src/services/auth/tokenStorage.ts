import CryptoJS from 'crypto-js';

export class TokenStorage {
  private static readonly TOKEN_KEY = 'drive_oauth_token';
  private static readonly ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'default-dev-key';

  static encryptToken(token: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(token),
      this.ENCRYPTION_KEY
    ).toString();
  }

  static decryptToken(encryptedToken: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.ENCRYPTION_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Erreur lors du déchiffrement du token:', error);
      return null;
    }
  }

  static storeToken(token: any): void {
    try {
      const encryptedToken = this.encryptToken(token);
      localStorage.setItem(this.TOKEN_KEY, encryptedToken);
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
      throw error;
    }
  }

  static getStoredToken(): any {
    try {
      const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
      if (!encryptedToken) return null;
      return this.decryptToken(encryptedToken);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isTokenExpired(token: any): boolean {
    if (!token || !token.expiry_date) return true;
    // Ajouter une marge de 5 minutes
    return token.expiry_date < (Date.now() + 5 * 60 * 1000);
  }
}