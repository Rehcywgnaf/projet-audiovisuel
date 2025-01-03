import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, RefreshCw, AlertTriangle } from 'lucide-react';

const TokenManager = () => {
  const defaultConfig = {
    tokenConfig: {
      expiresIn: "7d",
      lastRotation: new Date().toISOString(),
      refreshRate: "6d",
      scope: ["https://www.googleapis.com/auth/drive.file"]
    },
    driveConfig: {
      rootFolderId: null,
      temporaryFolderId: null,
      maxRetries: 3,
      retryDelay: 1000
    }
  };

  const [tokenStatus, setTokenStatus] = useState({
    isValid: false,
    expiresIn: null,
    lastRotation: null,
    config: defaultConfig
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    initializeToken();
  }, []);

  const initializeToken = async () => {
    try {
      // Simuler une vérification du token avec Google
      const isValid = Math.random() > 0.5; // Pour la démo

      setTokenStatus({
        isValid: isValid,
        expiresIn: defaultConfig.tokenConfig.expiresIn,
        lastRotation: defaultConfig.tokenConfig.lastRotation,
        config: defaultConfig
      });
    } catch (err) {
      setError('Erreur lors de l\'initialisation du token : ' + err.message);
      console.error('Token initialization error:', err);
    }
  };

  const resetToken = async () => {
    try {
      const newConfig = {
        ...defaultConfig,
        tokenConfig: {
          ...defaultConfig.tokenConfig,
          lastRotation: new Date().toISOString()
        }
      };
      
      setTokenStatus({
        isValid: true,
        expiresIn: newConfig.tokenConfig.expiresIn,
        lastRotation: newConfig.tokenConfig.lastRotation,
        config: newConfig
      });

      setError(null);
    } catch (err) {
      setError('Erreur lors de la réinitialisation : ' + err.message);
      console.error('Reset error:', err);
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Gestionnaire de Tokens Drive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statut du Token:</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    tokenStatus.isValid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tokenStatus.isValid ? 'Valide' : 'Invalide'}
                  </span>
                </div>
                
                {tokenStatus.expiresIn && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Durée de validité:</span>
                    <span className="text-sm">{tokenStatus.expiresIn}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dernière rotation:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {tokenStatus.lastRotation ? formatDate(tokenStatus.lastRotation) : 'Jamais'}
                    </span>
                    <RefreshCw 
                      className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800" 
                      onClick={() => initializeToken()}
                    />
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={resetToken}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réinitialiser le token
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenManager;