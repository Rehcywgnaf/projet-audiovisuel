import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useDriveAuth } from './DriveAuthProvider';

export default function DriveAuth() {
  const { isAuthenticated, isInitializing, error, login, logout } = useDriveAuth();

  if (isInitializing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p>Initialisation de Google Drive...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Drive</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Connecté à Google Drive</span>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              Se déconnecter
            </Button>
          </div>
        ) : (
          <Button 
            onClick={login}
            className="w-full"
          >
            Se connecter à Google Drive
          </Button>
        )}
      </CardContent>
    </Card>
  );
}