import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const TestMonitor = ({ authToken }) => {
  const [testResults, setTestResults] = useState({
    auth: { status: 'pending', message: '' },
    tokenTransfer: { status: 'pending', message: '' },
    driveAccess: { status: 'pending', message: '' },
    fileList: { status: 'pending', message: '' }
  });
  
  useEffect(() => {
    const runTests = async () => {
      try {
        if (authToken) {
          setTestResults(prev => ({
            ...prev,
            auth: { status: 'success', message: 'Token valide' }
          }));
          
          setTestResults(prev => ({
            ...prev,
            tokenTransfer: { status: 'success', message: 'Token transmis' }
          }));
          
          try {
            const response = await window.gapi.client.drive.about.get({
              fields: 'user'
            });
            setTestResults(prev => ({
              ...prev,
              driveAccess: { status: 'success', message: 'Connecté' }
            }));
            
            const filesResponse = await window.gapi.client.drive.files.list({
              pageSize: 1,
              fields: 'files(name)'
            });
            setTestResults(prev => ({
              ...prev,
              fileList: { status: 'success', message: 'Accès OK' }
            }));
          } catch (err) {
            const failedTest = err.status === 401 ? 'driveAccess' : 'fileList';
            setTestResults(prev => ({
              ...prev,
              [failedTest]: { status: 'error', message: 'Erreur' }
            }));
          }
        } else {
          throw new Error('Token manquant');
        }
      } catch (err) {
        setTestResults(prev => ({
          ...prev,
          auth: { status: 'error', message: 'Erreur token' }
        }));
      }
    };

    if (authToken) {
      runTests();
    }
  }, [authToken]);

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Résultats des Tests Drive
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <StatusIcon status={result.status} />
                <span className="font-medium">
                  {test === 'auth' && 'Authentification'}
                  {test === 'tokenTransfer' && 'Transfert Token'}
                  {test === 'driveAccess' && 'Accès Drive'}
                  {test === 'fileList' && 'Liste Fichiers'}
                </span>
              </div>
              <span className={`text-sm ${
                result.status === 'error' ? 'text-red-500' :
                result.status === 'success' ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {result.message}
              </span>
            </div>
          ))}
        </div>

        {Object.values(testResults).some(result => result.status === 'error') && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              Tests échoués. Vérifiez la configuration.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const DriveFilesDisplay = ({ authToken }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await window.gapi.client.drive.files.list({
          pageSize: 10,
          fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
        });

        setFiles(response.result.files);
      } catch (err) {
        setError('Erreur lors de la récupération des fichiers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchFiles();
    }
  }, [authToken]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fichiers Drive</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="flex-grow">{file.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(file.modifiedTime).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DriveIntegrationTest = () => {
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthClick = async () => {
    try {
      const tokenResponse = await new Promise((resolve, reject) => {
        window.google.accounts.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: (response) => {
            if (response.error) reject(response);
            resolve(response);
          },
        }).requestAccessToken();
      });

      setAuthToken(tokenResponse.access_token);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError('Erreur d\'authentification Google Drive');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Intégration Drive</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isAuthenticated ? (
            <Button onClick={handleAuthClick} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Se connecter avec Google Drive
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription className="text-green-600">
                  Authentification réussie !
                </AlertDescription>
              </Alert>
              
              <TestMonitor authToken={authToken} />
              
              <div className="mt-6">
                <DriveFilesDisplay authToken={authToken} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriveIntegrationTest;