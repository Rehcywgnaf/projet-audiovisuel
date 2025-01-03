import { DriveConfig } from '../driveConfig';
import { google } from 'googleapis';

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn(() => ({
        setCredentials: jest.fn(),
        getToken: jest.fn(),
        generateAuthUrl: jest.fn(() => 'mock-auth-url'),
        refreshToken: jest.fn()
      }))
    },
    drive: jest.fn(() => ({
      files: {
        list: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    }))
  }
}));

describe('DriveConfig', () => {
  let driveConfig: DriveConfig;
  const mockCredentials = {
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
    redirectUri: 'mock-redirect-uri'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    driveConfig = DriveConfig.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('devrait retourner la même instance à chaque appel de getInstance', () => {
      const instance1 = DriveConfig.getInstance();
      const instance2 = DriveConfig.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Initialisation', () => {
    it('devrait initialiser correctement avec des credentials valides', async () => {
      await expect(driveConfig.initialize(mockCredentials))
        .resolves.not.toThrow();
      
      expect(google.auth.OAuth2).toHaveBeenCalledWith(
        mockCredentials.clientId,
        mockCredentials.clientSecret,
        mockCredentials.redirectUri
      );
    });

    it('devrait lever une erreur si l\'initialisation échoue', async () => {
      (google.auth.OAuth2 as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Mock initialization error');
      });

      await expect(driveConfig.initialize(mockCredentials))
        .rejects.toThrow('Échec de l\'initialisation de Drive');
    });
  });

  describe('Authentication', () => {
    const mockAuthCode = 'mock-auth-code';
    const mockTokens = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expiry_date: Date.now() + 3600000
    };

    beforeEach(async () => {
      await driveConfig.initialize(mockCredentials);
    });

    it('devrait authentifier avec succès avec un code valide', async () => {
      const mockOAuth2Client = google.auth.OAuth2();
      mockOAuth2Client.getToken.mockResolvedValueOnce({ tokens: mockTokens });

      await expect(driveConfig.authenticate(mockAuthCode))
        .resolves.not.toThrow();
      
      expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith(mockTokens);
    });

    it('devrait lever une erreur si l\'authentification échoue', async () => {
      const mockOAuth2Client = google.auth.OAuth2();
      mockOAuth2Client.getToken.mockRejectedValueOnce(new Error('Auth failed'));

      await expect(driveConfig.authenticate(mockAuthCode))
        .rejects.toThrow('Échec de l\'authentification');
    });
  });
});