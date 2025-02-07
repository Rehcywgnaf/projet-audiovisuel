'use client';

import { useState } from 'react';

const TOKEN_KEY = 'drive_oauth_token';

export function useToken() {
  const [token, setToken] = useState<any>(null);

  const getToken = () => {
    try {
      if (typeof window === 'undefined') return null;
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) return null;
      return JSON.parse(storedToken);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const saveToken = (newToken: any) => {
    try {
      if (typeof window === 'undefined') return;
      if (!newToken) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        return;
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setToken(newToken);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const removeToken = () => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return {
    token: token || getToken(),
    saveToken,
    removeToken,
    getToken
  };
}

export function isTokenExpired(token: any): boolean {
  if (!token || !token.expiry_date) return true;
  return Date.now() >= token.expiry_date;
}