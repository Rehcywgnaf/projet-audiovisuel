import { AuthService } from '../authService';
import { TokenStorage } from '../tokenStorage';
import { OAuth2Client } from 'google-auth-library';

jest.mock('google-auth-library');
jest.mock('../tokenStorage');

describe('AuthService', () => {
  let authService: AuthService;
  const mockConfig = {
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
    redirectUri: 'mock-redirect-uri',
    scopes: ['mock-scope']
  };

  const mockTokens = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expiry_date: Date.now() + 3600000
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authService = AuthService.getInstance();
    
    (TokenStorage.getStoredToken as jest.Mock).mockReturnValue(null);
    (TokenStorage.storeToken as jest.Mock).mockImplementation(() => {});
    (TokenStorage.isTokenExpired as jest.Mock).mockReturnValue(false);
  });

  describe('Initialization', () => {
    it('should initialize with stored token if available', () => {
      (TokenStorage.getStoredToken as jest.Mock).mockReturnValue(mockTokens);
      
      authService.initialize(mockConfig);
      
      expect(TokenStorage.getStoredToken).toHaveBeenCalled();
      expect(OAuth2Client).toHaveBeenCalledWith(
        mockConfig.clientId,
        mockConfig.clientSecret,
        mockConfig.redirectUri
      );
    });

    it('should handle expired token during initialization', () => {
      (TokenStorage.getStoredToken as jest.Mock).mockReturnValue(mockTokens);
      (TokenStorage.isTokenExpired as jest.Mock).mockReturnValue(true);
      
      authService.initialize(mockConfig);
      
      expect(TokenStorage.isTokenExpired).toHaveBeenCalled();
    });
  });

  describe('Authentication', () => {
    const mockAuthCode = 'mock-auth-code';

    beforeEach(() => {
      authService.initialize(mockConfig);
    });

    it('should store tokens after successful authentication', async () => {
      const mockOAuth2Client = new OAuth2Client();
      (mockOAuth2Client.getToken as jest.Mock).mockResolvedValueOnce({ tokens: mockTokens });
      
      await authService.authenticate(mockAuthCode);
      
      expect(TokenStorage.storeToken).toHaveBeenCalledWith(mockTokens);
    });

    it('should throw error if not initialized', async () => {
      const newAuthService = AuthService.getInstance();
      await expect(newAuthService.authenticate(mockAuthCode))
        .rejects.toThrow('AuthService non initialisé');
    });
  });

  describe('Token Refresh', () => {
    beforeEach(() => {
      authService.initialize(mockConfig);
    });

    it('should refresh and store new token', async () => {
      const mockOAuth2Client = new OAuth2Client();
      (mockOAuth2Client.refreshAccessToken as jest.Mock).mockResolvedValueOnce({
        credentials: mockTokens
      });
      
      await authService.refreshToken();
      
      expect(TokenStorage.storeToken).toHaveBeenCalledWith(mockTokens);
    });

    it('should throw error if no refresh token available', async () => {
      const mockOAuth2Client = new OAuth2Client();
      mockOAuth2Client.credentials = {};
      
      await expect(authService.refreshToken())
        .rejects.toThrow('Pas de refresh token disponible');
    });
  });

  describe('Logout', () => {
    it('should clear tokens and revoke credentials', () => {
      authService.initialize(mockConfig);
      authService.logout();
      
      expect(TokenStorage.removeToken).toHaveBeenCalled();
    });
  });
});