import { AuthService } from '../AuthService';
import { TokenStorage } from '../TokenStorage';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

jest.mock('../TokenStorage');
jest.mock('firebase/auth');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = AuthService.getInstance();
  });

  describe('getInstance', () => {
    it('should always return the same instance', () => {
      const instance1 = AuthService.getInstance();
      const instance2 = AuthService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should accept custom options', () => {
      const instance = AuthService.getInstance({ autoRefresh: false });
      expect(instance.getState().isAuthenticated).toBe(false);
    });
  });

  describe('authenticate', () => {
    it('should use cached token if valid', async () => {
      const mockToken = {
        token: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
        type: 'default'
      };

      jest.spyOn(TokenStorage.prototype, 'getToken')
        .mockResolvedValue(mockToken);

      const result = await authService.authenticate();
      expect(result).toBe(mockToken.token);
      expect(authService.getState().isAuthenticated).toBe(true);
    });

    it('should refresh token if expired', async () => {
      const expiredToken = {
        token: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 1000,
        type: 'default'
      };

      jest.spyOn(TokenStorage.prototype, 'getToken')
        .mockResolvedValue(expiredToken);

      const mockNewToken = 'new-token';
      (signInWithPopup as jest.Mock).mockResolvedValue({
        user: { getIdToken: () => Promise.resolve(mockNewToken) }
      });

      const result = await authService.authenticate();
      expect(result).toBe(mockNewToken);
    });

    it('should handle authentication errors', async () => {
      jest.spyOn(TokenStorage.prototype, 'getToken')
        .mockRejectedValue(new Error('Auth failed'));

      await expect(authService.authenticate()).rejects.toThrow();
      expect(authService.getState().isAuthenticated).toBe(false);
      expect(authService.getState().error).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should clear tokens and state', async () => {
      const clearAllTokens = jest.spyOn(TokenStorage.prototype, 'clearAllTokens');
      
      await authService.logout();
      
      expect(clearAllTokens).toHaveBeenCalled();
      expect(authService.getState().isAuthenticated).toBe(false);
      expect(authService.getState().lastRefresh).toBeNull();
    });
  });

  describe('auto refresh', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should setup auto refresh for valid tokens', async () => {
      const mockToken = {
        token: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
        type: 'default'
      };

      jest.spyOn(TokenStorage.prototype, 'getToken')
        .mockResolvedValue(mockToken);

      await authService.authenticate();
      
      jest.advanceTimersByTime(3300000); // 55 minutes
      
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });
});
