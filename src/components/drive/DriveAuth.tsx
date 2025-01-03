import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { driveAuthService } from '../../services/drive/auth';

export default function DriveAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const checkAuth = () => {
      try {
        const isAuth = driveAuthService.isAuthenticated();
        setIsAuthenticated(isAuth);
      } catch (err) {
        setError('Erreur lors de la vérification de l\'authentification');
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const authUrl = driveAuthService.getAuthUrl();
      // Ouvrir la fenêtre d'authentification Google
      window.location.href = authUrl;
    } catch (err) {
      setError('Erreur lors de l\'authentification Google Drive');
    }
  };

  const handleLogout = () => {
    // Implémenter la déconnexion
    setIsAuthenticated(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Drive Integration</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-green-600">✓ Connecté à Google Drive</p>
            <Button 
              onClick={handleLogout}
              variant="outline"
            >
              Se déconnecter
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleLogin}
            className="w-full"
          >
            Se connecter à Google Drive
          </Button>
        )}
      </CardContent>
    </Card>
  );
}