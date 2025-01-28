import { TokenStorage } from '../TokenStorage';
import { AuthToken } from '../types/Auth';

describe('TokenStorage', () => {
  let tokenStorage: TokenStorage;
  let mockStorage: Storage;

  const mockToken: AuthToken = {
    token: 'test-token',
    refreshToken: 'refresh-token',
    expiresAt: Date.now() + 3600000,
    type: 'default'
  };

  beforeEach(() => {
    mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn()
    };
    tokenStorage = new TokenStorage(mockStorage);
  });

  describe('getToken', () => {
    it('should return null if no token exists', async () => {
      mockStorage.getItem = jest.fn().mockReturnValue(null);
      const result = await tokenStorage.getToken();
      expect(result).toBeNull();
    });

    it('should return decrypted token if valid', async () => {
      // Implementation depends on your encryption logic
    });
  });

  describe('setToken', () => {
    it('should store encrypted token', async () => {
      await tokenStorage.setToken(mockToken);
      expect(mockStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('clearToken', () => {
    it('should remove specific token', async () => {
      await tokenStorage.clearToken('default');
      expect(mockStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('clearAllTokens', () => {
    it('should clear all tokens', async () => {
      mockStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(['default', 'other']));
      await tokenStorage.clearAllTokens();
      expect(mockStorage.removeItem).toHaveBeenCalledTimes(3); // 2 tokens + list
    });
  });
});
