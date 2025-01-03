import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DriveAuthProvider, useDriveAuth } from '../DriveAuthProvider';
import { DriveConfig } from '../../../../services/drive/driveConfig';

jest.mock('../../../../services/drive/driveConfig');

function TestComponent() {
  const { isAuthenticated, isInitializing, error, login, logout } = useDriveAuth();
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      <div data-testid="loading-status">
        {isInitializing ? 'initializing' : 'not-initializing'}
      </div>
      {error && <div data-testid="error-message">{error}</div>}
      <button onClick={login} data-testid="login-button">
        Login
      </button>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
}

describe('DriveAuthProvider - Gestion des erreurs Google API', () => {
  const mockGetInstance = DriveConfig.getInstance as jest.Mock;
  const mockDriveConfig = {
    initialize: jest.fn(),
    authenticate: jest.fn(),
    getAuthUrl: jest.fn(),
    logout: jest.fn(),
    refreshTokenIfNeeded: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInstance.mockReturnValue(mockDriveConfig);
    delete window.location;
    window.location = new URL('http://localhost') as any;
  });

  describe('Erreurs d\'initialisation', () => {
    it('gère les erreurs de configuration invalide', async () => {
      mockDriveConfig.initialize.mockRejectedValueOnce(
        new Error('Invalid client configuration')
      );

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Invalid client configuration'
      );
    });

    it('gère les problèmes de réseau pendant l\'initialisation', async () => {
      mockDriveConfig.initialize.mockRejectedValueOnce(
        new Error('Network error')
      );

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Network error'
      );
    });
  });

  describe('Erreurs d\'authentification', () => {
    it('gère le refus d\'autorisation par l\'utilisateur', async () => {
      window.location = new URL('http://localhost?error=access_denied') as any;

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Autorisation refusée'
      );
    });

    it('gère les erreurs de token invalide', async () => {
      mockDriveConfig.authenticate.mockRejectedValueOnce(
        new Error('Invalid token')
      );

      window.location = new URL('http://localhost?code=invalid_code') as any;

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Invalid token'
      );
    });

    it('gère les erreurs de refresh token', async () => {
      mockDriveConfig.refreshTokenIfNeeded.mockRejectedValueOnce(
        new Error('Token refresh failed')
      );

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Token refresh failed'
      );
    });
  });

  describe('Erreurs de scope', () => {
    it('gère les erreurs de permissions insuffisantes', async () => {
      mockDriveConfig.authenticate.mockRejectedValueOnce(
        new Error('Insufficient permissions')
      );

      window.location = new URL('http://localhost?code=test_code') as any;

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Insufficient permissions'
      );
    });
  });

  describe('Erreurs de quota', () => {
    it('gère les erreurs de quota dépassé', async () => {
      mockDriveConfig.authenticate.mockRejectedValueOnce(
        new Error('Quota exceeded')
      );

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Quota exceeded'
      );
    });
  });

  describe('Gestion de la récupération après erreur', () => {
    it('permet une nouvelle tentative de connexion après une erreur', async () => {
      mockDriveConfig.getAuthUrl.mockImplementationOnce(() => {
        throw new Error('Network error');
      }).mockImplementationOnce(() => 'https://google.com/auth');

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      const loginButton = screen.getByTestId('login-button');
      
      // Première tentative - échec
      await act(async () => {
        fireEvent.click(loginButton);
      });
      expect(screen.getByTestId('error-message')).toHaveTextContent('Network error');

      // Deuxième tentative - succès
      await act(async () => {
        fireEvent.click(loginButton);
      });
      expect(window.location.href).toBe('https://google.com/auth');
    });

    it('réinitialise les erreurs après une déconnexion réussie', async () => {
      mockDriveConfig.getAuthUrl.mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await act(async () => {
        render(
          <DriveAuthProvider>
            <TestComponent />
          </DriveAuthProvider>
        );
      });

      // Générer une erreur
      await act(async () => {
        fireEvent.click(screen.getByTestId('login-button'));
      });
      expect(screen.getByTestId('error-message')).toBeInTheDocument();

      // Se déconnecter
      await act(async () => {
        fireEvent.click(screen.getByTestId('logout-button'));
      });
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });
});