'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DriveContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
}

const DriveContext = createContext<DriveContextType | null>(null);

export function DriveProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérification initiale de l'état d'authentification
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/drive/operation/status');
        if (!response.ok) throw new Error('Erreur lors de la vérification du statut');
        
        const { isAuthenticated } = await response.json();
        setIsAuthenticated(isAuthenticated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de vérification du statut');
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <DriveContext.Provider
      value={{
        isAuthenticated,
        isInitializing,
        error
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