'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DriveContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
  checkAuthStatus: () => Promise<void>;
}

const DriveContext = createContext<DriveContextType | null>(null);

export function DriveProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const response = await fetch('/api/drive/operation/status');
      if (!response.ok) throw new Error('Erreur lors de la vérification du statut');
      
      const data = await response.json();
      console.log('Auth status response:', data);
      setIsAuthenticated(data.isAuthenticated);
    } catch (err) {
      console.error('Auth status error:', err);
      setError(err instanceof Error ? err.message : 'Erreur de vérification du statut');
    } finally {
      setIsInitializing(false);
    }
  };

  // Vérification initiale de l'état d'authentification
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Surveiller les changements d'URL pour détecter les retours de l'authentification
  useEffect(() => {
    const handleRouteChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('status') && searchParams.get('status') === 'success') {
        console.log('Auth success detected in URL');
        checkAuthStatus();
        // Nettoyer l'URL
        window.history.replaceState({}, '', '/');
      }
    };

    // Vérifier au montage
    handleRouteChange();

    // Écouter les changements de route
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
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