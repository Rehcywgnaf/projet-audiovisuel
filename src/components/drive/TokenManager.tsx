import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, RefreshCw, AlertTriangle } from 'lucide-react';

const TokenManager = () => {
  const [tokenStatus, setTokenStatus] = useState({
    isValid: false,
    expiresIn: null,
    lastRotation: null
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = async () => {
    try {
      const response = await window.fs.readFile('drive-config.json', { encoding: 'utf8' });
      const config = JSON.parse(response);
      
      setTokenStatus({
        isValid: true,
        expiresIn: config.expiresIn,
        lastRotation: config.lastRotation
      });
    } catch (err) {
      setError('Erreur lors de la vérification du token');
      console.error('Token check error:', err);
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
                    <span className="text-sm text-gray-600">Expire dans:</span>
                    <span className="text-sm">{tokenStatus.expiresIn}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dernière rotation:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {tokenStatus.lastRotation || 'Jamais'}
                    </span>
                    <RefreshCw 
                      className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800" 
                      onClick={checkTokenStatus}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenManager;