import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCcw, Folder, File, AlertTriangle, Users, Lock, CheckCircle, XCircle, Clock } from 'lucide-react';

// Test Component
const DriveManagerTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTests = async () => {
    setIsRunningTests(true);
    const results = {};

    try {
      const authInstance = await window.gapi?.auth2?.getAuthInstance();
      results.auth = {
        status: authInstance ? 'success' : 'error',
        message: authInstance ? 'Auth instance disponible' : 'Auth instance non disponible'
      };
    } catch (err) {
      results.auth = {
        status: 'error',
        message: `Erreur auth: ${err.message}`
      };
    }

    try {
      const cachedData = localStorage.getItem('driveCache');
      results.cache = {
        status: cachedData ? 'success' : 'warning',
        message: cachedData ? 'Cache trouvé' : 'Cache non initialisé'
      };
    } catch (err) {
      results.cache = {
        status: 'error',
        message: `Erreur cache: ${err.message}`
      };
    }

    try {
      const response = await window.gapi?.client?.drive?.files?.list({
        pageSize: 1,
        fields: 'files(id, name)'
      });
      results.files = {
        status: response ? 'success' : 'error',
        message: response ? 'API files accessible' : 'API files non accessible'
      };
    } catch (err) {
      results.files = {
        status: 'error',
        message: `Erreur files: ${err.message}`
      };
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const getStatusIcon = (status) => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tests UnifiedDriveManager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <button
              onClick={runTests}
              disabled={isRunningTests}
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