import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DriveAuth from '../DriveAuth';
import { DriveAuthProvider } from '../DriveAuthProvider';

// Mock du hook useDriveAuth
jest.mock('../DriveAuthProvider', () => {
  return {
    useDriveAuth: jest.fn(),
    DriveAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
  };
});

// Import le mock pour le manipuler dans les tests
import { useDriveAuth } from '../DriveAuthProvider';

describe('DriveAuth', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le loader pendant l\'initialisation', () => {
    (useDriveAuth as jest.Mock).mockReturnValue({
      isInitializing: true,
      isAuthenticated: false,
      error: null,
      login: mockLogin,
      logout: mockLogout
    });

    render(<DriveAuth />);
    expect(screen.getByText('Initialisation de Google Drive...')).toBeInTheDocument();
  });

  it('affiche le bouton de connexion quand non authentifié', () => {
    (useDriveAuth as jest.Mock).mockReturnValue({
      isInitializing: false,
      isAuthenticated: false,
      error: null,
      login: mockLogin,
      logout: mockLogout
    });

    render(<DriveAuth />);
    const loginButton = screen.getByText('Se connecter à Google Drive');
    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalled();
  });

  it('affiche le bouton de déconnexion quand authentifié', () => {
    (useDriveAuth as jest.Mock).mockReturnValue({
      isInitializing: false,
      isAuthenticated: true,
      error: null,
      login: mockLogin,
      logout: mockLogout
    });

    render(<DriveAuth />);
    expect(screen.getByText('Connecté à Google Drive')).toBeInTheDocument();
    const logoutButton = screen.getByText('Se déconnecter');
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('affiche les messages d\'erreur', () => {
    (useDriveAuth as jest.Mock).mockReturnValue({
      isInitializing: false,
      isAuthenticated: false,
      error: 'Erreur de connexion',
      login: mockLogin,
      logout: mockLogout
    });

    render(<DriveAuth />);
    expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
  });

  // Test de l'intégration des composants shadcn/ui
  it('utilise correctement les composants shadcn/ui', () => {
    (useDriveAuth as jest.Mock).mockReturnValue({
      isInitializing: false,
      isAuthenticated: false,
      error: null,
      login: mockLogin,
      logout: mockLogout
    });

    render(<DriveAuth />);
    
    // Vérifie la présence des classes Tailwind
    expect(screen.getByRole('button')).toHaveClass('w-full');
    expect(document.querySelector('.max-w-md')).toBeInTheDocument();
  });

  describe('Gestion des états', () => {
    it('transition correctement entre les états', () => {
      // État initial : non authentifié
      (useDriveAuth as jest.Mock).mockReturnValue({
        isInitializing: false,
        isAuthenticated: false,
        error: null,
        login: mockLogin,
        logout: mockLogout
      });

      const { rerender } = render(<DriveAuth />);
      expect(screen.getByText('Se connecter à Google Drive')).toBeInTheDocument();

      // Transition vers l'état authentifié
      (useDriveAuth as jest.Mock).mockReturnValue({
        isInitializing: false,
        isAuthenticated: true,
        error: null,
        login: mockLogin,
        logout: mockLogout
      });

      rerender(<DriveAuth />);
      expect(screen.getByText('Connecté à Google Drive')).toBeInTheDocument();
    });
  });
});