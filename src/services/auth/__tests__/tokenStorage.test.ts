import { TokenStorage } from '../tokenStorage';

describe('TokenStorage', () => {
  const mockToken = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expiry_date: Date.now() + 3600000 // expire dans 1 heure
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Token Encryption/Decryption', () => {
    it('should encrypt and decrypt token correctly', () => {
      const encrypted = TokenStorage.encryptToken(mockToken);
      expect(typeof encrypted).toBe('string');
      
      const decrypted = TokenStorage.decryptToken(encrypted);
      expect(decrypted).toEqual(mockToken);
    });

    it('should return null when decrypting invalid token', () => {
      const result = TokenStorage.decryptToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('Token Storage Operations', () => {
    it('should store and retrieve token successfully', () => {
      TokenStorage.storeToken(mockToken);
      const retrieved = TokenStorage.getStoredToken();
      expect(retrieved).toEqual(mockToken);
    });

    it('should handle missing token gracefully', () => {
      const retrieved = TokenStorage.getStoredToken();
      expect(retrieved).toBeNull();
    });

    it('should remove token successfully', () => {
      TokenStorage.storeToken(mockToken);
      TokenStorage.removeToken();
      const retrieved = TokenStorage.getStoredToken();
      expect(retrieved).toBeNull();
    });
  });

  describe('Token Expiration Check', () => {
    it('should correctly identify non-expired token', () => {
      const nonExpiredToken = {
        ...mockToken,
        expiry_date: Date.now() + 3600000 // expire dans 1 heure
      };
      expect(TokenStorage.isTokenExpired(nonExpiredToken)).toBeFalsy();
    });

    it('should correctly identify expired token', () => {
      const expiredToken = {
        ...mockToken,
        expiry_date: Date.now() - 3600000 // expiré il y a 1 heure
      };
      expect(TokenStorage.isTokenExpired(expiredToken)).toBeTruthy();
    });

    it('should handle null or invalid token', () => {
      expect(TokenStorage.isTokenExpired(null)).toBeTruthy();
      expect(TokenStorage.isTokenExpired({})).toBeTruthy();
      expect(TokenStorage.isTokenExpired({ expiry_date: null })).toBeTruthy();
    });

    it('should consider token near expiration as expired', () => {
      const nearExpirationToken = {
        ...mockToken,
        expiry_date: Date.now() + (4 * 60 * 1000) // expire dans 4 minutes
      };
      expect(TokenStorage.isTokenExpired(nearExpirationToken)).toBeTruthy();
    });
  });
});