export class TokenStorage {
  private static readonly TOKEN_KEY = 'drive_oauth_token';

  static async getStoredToken(): Promise<any | null> {
    try {
      if (typeof window === 'undefined') {
        console.log('Attempting to get token in server environment');
        return null;
      }
      console.log('Getting token from localStorage');
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }
      console.log('Token found in localStorage');
      const parsedToken = JSON.parse(token);
      console.log('Token validity:', !this.isTokenExpired(parsedToken));
      return parsedToken;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static isTokenExpired(token: any): boolean {
    if (!token || !token.expiry_date) {
      console.log('Token is invalid or missing expiry_date');
      return true;
    }
    const now = Date.now();
    const isExpired = now > token.expiry_date;
    console.log('Token expiry check:', {
      now,
      expiryDate: token.expiry_date,
      isExpired
    });
    return isExpired;
  }

  static async storeToken(token: any): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        console.log('Cannot store token in server environment');
        return;
      }
      
      // Ensure token has required fields
      if (!token || !token.access_token) {
        console.error('Invalid token format');
        throw new Error('Invalid token format');
      }

      // Add expiry date if not present
      if (!token.expiry_date && token.expires_in) {
        token.expiry_date = Date.now() + token.expires_in * 1000;
      }

      console.log('Storing token in localStorage');
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
      console.log('Token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  static removeToken(): void {
    try {
      if (typeof window === 'undefined') {
        console.log('Cannot remove token in server environment');
        return;
      }
      console.log('Removing token from localStorage');
      localStorage.removeItem(this.TOKEN_KEY);
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
}