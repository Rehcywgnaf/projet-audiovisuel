import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DriveAuthProvider, useDriveAuth } from '../DriveAuthProvider';
import { DriveConfig } from '../../../../services/drive/driveConfig';

// Mock le DriveConfig
jest.mock('../../../../services/drive/driveConfig');

// Composant de test pour utiliser le hook
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

describe('DriveAuthProvider', () => {
  const mockGetInstance = DriveConfig.getInstance as jest.Mock;
  const mockDriveConfig = {
    initialize: jest.fn(),
    authenticate: jest.fn(),
    getAuthUrl: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInstance.mockReturnValue(mockDriveConfig);
    // Réinitialiser l'URL
    delete window.location;
    window.location = new URL('http://localhost') as any;
  });

  it('initialise correctement sans code d\'authentification', async () => {
    await act(async () => {
      render(
        <DriveAuthProvider>
          <TestComponent />
        </DriveAuthProvider>
      );
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('not-initializing');
  });

  it('gère le processus de login correctement', async () => {
    mockDriveConfig.getAuthUrl.mockReturnValue('https://google.com/auth');
    
    await act(async () => {
      render(
        <DriveAuthProvider>
          <TestComponent />
        </DriveAuthProvider>
      );
    });

    const loginButton = screen.getByTestId('login-button');
    
    // Simuler le clic sur le bouton de login
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(mockDriveConfig.getAuthUrl).toHaveBeenCalled();
    expect(window.location.href).toBe('https://google.com/auth');
  });

  it('gère les erreurs de login', async () => {
    mockDriveConfig.getAuthUrl.mockImplementation(() => {
      throw new Error('Erreur de connexion');
    });

    await act(async () => {
      render(
        <DriveAuthProvider>
          <TestComponent />
        </DriveAuthProvider>
      );
    });

    const loginButton = screen.getByTestId('login-button');
    
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(screen.getByTestId('error-message')).toHaveTextContent('Erreur de connexion');
  });

  it('gère le processus de logout correctement', async () => {
    await act(async () => {
      render(
        <DriveAuthProvider>
          <TestComponent />
        </DriveAuthProvider>
      );
    });

    const logoutButton = screen.getByTestId('logout-button');
    
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(mockDriveConfig.logout).toHaveBeenCalled();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  it('gère l\'authentification avec code dans l\'URL', async () => {
    // Simuler un code dans l'URL
    window.location = new URL('http://localhost?code=test-auth-code') as any;

    await act(async () => {
      render(
        <DriveAuthProvider>
          <TestComponent />
        </DriveAuthProvider>
      );
    });

    expect(mockDriveConfig.authenticate).toHaveBeenCalledWith('test-auth-code');
  });
});