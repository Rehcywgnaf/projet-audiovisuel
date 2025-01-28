'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import DriveConfig from '../Core/DriveConfig';

interface DriveAuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  driveInstance: DriveConfig | null;
}

const DriveAuthContext = createContext<DriveAuthContextType | null>(null);

export function DriveAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driveInstance, setDriveInstance] = useState<DriveConfig | null>(null);

  useEffect(() => {
    initializeDrive();
  }, []);

  const initializeDrive = async () => {
    try {
      const driveConfig = DriveConfig.getInstance();
      await driveConfig.initialize({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
      });
      setDriveInstance(driveConfig);
      
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      
      if (authCode) {
        await driveConfig.authenticate(authCode);
        setIsAuthenticated(true);
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
      if (!driveInstance) {
        throw new Error('Drive non initialisé');
      }
      const authUrl = driveInstance.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  const logout = async () => {
    try {
      if (!driveInstance) {
        throw new Error('Drive non initialisé');
      }
      driveInstance.logout();
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
        logout,
        driveInstance
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