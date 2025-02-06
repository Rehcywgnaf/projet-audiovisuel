import CryptoJS from 'crypto-js';

export class TokenStorage {
  private static readonly TOKEN_KEY = 'drive_oauth_token';
  private static readonly ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'default-key';

  static async storeToken(token: any): Promise<void> {
    try {
      const encryptedToken = CryptoJS.AES.encrypt(
        JSON.stringify(token),
        this.ENCRYPTION_KEY
      ).toString();
      
      localStorage.setItem(this.TOKEN_KEY, encryptedToken);
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
      throw error;
    }
  }

  static async getStoredToken(): Promise<any | null> {
    try {
      const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
      if (!encryptedToken) return null;

      const decryptedToken = CryptoJS.AES.decrypt(
        encryptedToken,
        this.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedToken);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  static isTokenExpired(token: any): boolean {
    if (!token || !token.expiry_date) return true;
    return new Date().getTime() > token.expiry_date;
  }

  static removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  }
}
