"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import authClient from './authClient';

interface DriveAuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
}

const DriveAuthContext = createContext<DriveAuthContextType | null>(null);

export function DriveAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDrive();
  }, []);

  const initializeDrive = async () => {
    try {
      await authClient.initialize({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
      });
      
      // Vérifier si un code d'authentification est présent dans l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      
      if (authCode) {
        const authStatus = await authClient.authenticate(authCode);
        setIsAuthenticated(authStatus.isAuthenticated);
        if (authStatus.error) {
          setError(authStatus.error);
        }
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'initialisation de Google Drive');
    } finally {
      setIsInitializing(false);
    }
  };

  const login = async () => {
    try {
      const authUrl = await authClient.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  const logout = async () => {
    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de déconnexion');
    }
  };

  return (
    <DriveAuthContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        error,
        login,
        logout
      }}
    >
      {children}
    </DriveAuthContext.Provider>
  );
}

export function useDriveAuth() {
  const context = useContext(DriveAuthContext);
  if (!context) {
    throw new Error('useDriveAuth doit être utilisé dans un DriveAuthProvider');
  }
  return context;
}