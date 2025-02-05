'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DriveAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signOut, user } = useAuth();

  const handleAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Appel à l'API pour la déconnexion
        await fetch('/api/drive/operation/logout', {
          method: 'POST',
        });
        await signOut();
      } else {
        // Appel à l'API pour l'authentification
        const response = await fetch('/api/drive/operation/login', {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Erreur d\'authentification');
        await signIn();
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, signIn, signOut]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentification Google Drive</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleAuth} 
          disabled={isLoading}
        >
          {isLoading 
            ? 'Chargement...' 
            : user 
              ? 'Se déconnecter' 
              : 'Se connecter à Google Drive'
          }
        </Button>
      </CardContent>
    </Card>
  );
}