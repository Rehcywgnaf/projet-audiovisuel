'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DriveCore } from '../Core';

type DriveAuthContextType = {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const DriveAuthContext = createContext<DriveAuthContextType | null>(null);

export function DriveAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    await DriveCore.authenticate();
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // Code de déconnexion
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Vérification du statut d'authentification au montage
  }, []);

  return (
    <DriveAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </DriveAuthContext.Provider>
  );
}

export function useDriveAuth() {
  const context = useContext(DriveAuthContext);
  if (!context) {
    throw new Error('useDriveAuth must be used within a DriveAuthProvider');
  }
  return context;
}