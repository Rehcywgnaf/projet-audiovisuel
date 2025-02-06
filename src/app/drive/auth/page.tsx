'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DriveAuthProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  onLogin: () => void;
  onLogout: () => void;
}

export default function DriveAuthPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        // Déconnexion
        const response = await fetch('/api/drive/operation/logout', {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Erreur lors de la déconnexion');
        setIsAuthenticated(false);
      } else {
        // Connexion
        const response = await fetch('/api/drive/operation/auth-url');
        if (!response.ok) throw new Error('Erreur lors de la récupération de l\'URL d\'authentification');
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifie le code d'auth au chargement
  React.useEffect(() => {
    const validateAuthCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        setIsLoading(true);
        try {
          const response = await fetch('/api/drive/operation/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
          });
          
          if (!response.ok) throw new Error('Erreur d\'authentification');
          
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          
          // Nettoyer l'URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur lors de l\'authentification');
        } finally {
          setIsLoading(false);
        }
      }
    };

    validateAuthCode();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentification Google Drive</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        <Button 
          onClick={handleAuth} 
          disabled={isLoading}
          className={isAuthenticated ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
        >
          {isLoading 
            ? 'Chargement...' 
            : isAuthenticated 
              ? 'Se déconnecter' 
              : 'Se connecter à Google Drive'
          }
        </Button>
      </CardContent>
    </Card>
  );
}