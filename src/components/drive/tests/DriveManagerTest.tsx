import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useDriveAuth } from '../DriveAuthProvider';

const DriveManagerTest = () => {
  const { isAuthenticated, isInitializing, error, driveInstance } = useDriveAuth();
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTests = async () => {
    if (!driveInstance) {
      setTestResults({
        drive: {
          status: 'error',
          message: 'Instance Drive non initialisée'
        }
      });
      return;
    }

    setIsRunningTests(true);
    const results: Record<string, { status: string; message: string }> = {};

    // Test d'authentification
    results.auth = {
      status: isAuthenticated ? 'success' : 'error',
      message: isAuthenticated ? 'Authentification réussie' : 'Non authentifié'
    };

    try {
      // Test de listing des fichiers
      const files = await driveInstance.listFiles();
      results.files = {
        status: 'success',
        message: `${files.length} fichiers trouvés`
      };
    } catch (err) {
      results.files = {
        status: 'error',
        message: err instanceof Error ? err.message : 'Erreur lors du listing des fichiers'
      };
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (isInitializing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-6 w-6 animate-spin text-blue-500" />
            <p>Initialisation de Google Drive...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tests Drive Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <button
              onClick={runTests}
              disabled={isRunningTests || !isAuthenticated}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isRunningTests ? 'Tests en cours...' : 'Lancer les tests'}
            </button>

            <div className="space-y-2">
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="flex items-center gap-2 rounded-lg border p-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium">Test: {test}</p>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriveManagerTest;