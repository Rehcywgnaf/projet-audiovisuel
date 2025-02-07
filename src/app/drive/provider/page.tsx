'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToken, isTokenExpired } from '@/hooks/useToken';

interface DriveContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
  checkAuthStatus: () => Promise<void>;
}

const DriveContext = createContext<DriveContextType | null>(null);

export function DriveProvider({ children }: { children: React.ReactNode }) {
  const { token, saveToken, removeToken, getToken } = useToken();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const currentToken = getToken();
      
      if (!currentToken || isTokenExpired(currentToken)) {
        console.log('No valid token found');
        setIsAuthenticated(false);
        return;
      }

      console.log('Valid token found');
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Auth status error:', err);
      setError(err instanceof Error ? err.message : 'Erreur de vérification du statut');
      setIsAuthenticated(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAuth = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('auth') && searchParams.get('auth') === 'true') {
      console.log('Auth redirect detected, processing...');
      try {
        const response = await fetch('/api/drive/auth/handle', {
          method: 'POST'
        });
        
        if (!response.ok) {
          throw new Error('Failed to process authentication');
        }

        const data = await response.json();
        if (data.token) {
          console.log('Received new token from server');
          saveToken(data.token);
        }
        
        await checkAuthStatus();
        window.history.replaceState({}, '', '/');
      } catch (error) {
        console.error('Error processing authentication:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
      }
    }
  };

  // Vérification initiale de l'état d'authentification
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Gérer l'authentification au retour de Google
  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <DriveContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        error,
        checkAuthStatus
      }}
    >
      {children}
    </DriveContext.Provider>
  );
}

export function useDrive() {
  const context = useContext(DriveContext);
  if (!context) {
    throw new Error('useDrive doit être utilisé dans un DriveProvider');
  }
  return context;
}

export default DriveProvider;