import { DriveConfig } from '../driveConfig';
import { TokenStorage } from '../tokenStorage';
import { google } from 'googleapis';

jest.mock('googleapis');
jest.mock('../tokenStorage');

describe('DriveConfig', () => {
  let driveConfig: DriveConfig;
  const mockCredentials = {
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
    redirectUri: 'mock-redirect-uri'
  };

  const mockTokens = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expiry_date: Date.now() + 3600000
  };

  beforeEach(() => {
    jest.clearAllMocks();
    driveConfig = DriveConfig.getInstance();
    
    // Mock TokenStorage
    (TokenStorage.getStoredToken as jest.Mock).mockReturnValue(null);
    (TokenStorage.storeToken as jest.Mock).mockImplementation(() => {});
    (TokenStorage.isTokenExpired as jest.Mock).mockReturnValue(false);
  });

  describe('Initialization', () => {
    it('should initialize with stored token if available', async () => {
      (TokenStorage.getStoredToken as jest.Mock).mockReturnValue(mockTokens);
      
      await driveConfig.initialize(mockCredentials);
      
      expect(TokenStorage.getStoredToken).toHaveBeenCalled();
      expect(google.auth.OAuth2).toHaveBeenCalledWith(
        mockCredentials.clientId,
        mockCredentials.clientSecret,
        mockCredentials.redirectUri
      );
    });

    it('should refresh token if stored token is expired', async () => {
      (TokenStorage.getStoredToken as jest.Mock).mockReturnValue(mockTokens);
      (TokenStorage.isTokenExpired as jest.Mock).mockReturnValue(true);
      
      await driveConfig.initialize(mockCredentials);
      
      // Vérifier que refreshTokenIfNeeded a été appelé
      expect(TokenStorage.isTokenExpired).toHaveBeenCalled();
    });
  });

  describe('Authentication', () => {
    const mockAuthCode = 'mock-auth-code';

    beforeEach(async () => {
      await driveConfig.initialize(mockCredentials);
    });

    it('should store tokens after successful authentication', async () => {
      const mockOAuth2Client = google.auth.OAuth2();
      mockOAuth2Client.getToken.mockResolvedValueOnce({ tokens: mockTokens });
      
      await driveConfig.authenticate(mockAuthCode);
      
      expect(TokenStorage.storeToken).toHaveBeenCalledWith(mockTokens);
    });
  });

  describe('Token Refresh', () => {
    beforeEach(async () => {
      await driveConfig.initialize(mockCredentials);
    });

    it('should refresh and store new token', async () => {
      const mockOAuth2Client = google.auth.OAuth2();
      mockOAuth2Client.refreshToken.mockResolvedValueOnce({
        credentials: mockTokens
      });
      
      await driveConfig.refreshTokenIfNeeded();
      
      expect(TokenStorage.storeToken).toHaveBeenCalledWith(mockTokens);
    });
  });

  describe('Logout', () => {
    it('should clear tokens and reset client', async () => {
      await driveConfig.initialize(mockCredentials);
      driveConfig.logout();
      
      expect(TokenStorage.removeToken).toHaveBeenCalled();
      expect(driveConfig.getDriveAPI).toThrow('API Drive non initialisée');
    });
  });
});