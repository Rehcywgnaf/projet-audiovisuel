import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCcw, Folder, File, AlertTriangle, Users, Lock } from 'lucide-react';

const UnifiedDriveManager = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cachedData = localStorage.getItem('driveCache');
        if (cachedData) {
          setFiles(JSON.parse(cachedData));
        }
      } catch (err) {
        console.error('Cache error:', err);
      }
    };
    loadCache();
  }, []);

  useEffect(() => {
    const syncInterval = setInterval(async () => {
      if (window.gapi?.auth2?.getAuthInstance()?.isSignedIn.get()) {
        setSyncStatus('syncing');
        await loadDriveFiles();
        setSyncStatus('synced');
      }
    }, 300000);

    return () => clearInterval(syncInterval);
  }, []);

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      const authResult = await window.gapi.auth2.getAuthInstance().signIn();
      if (authResult) {
        await loadDriveFiles();
        await loadPermissions();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await window.gapi.client.drive.permissions.list({
        fileId: 'root',
        fields: 'permissions(id,emailAddress,role)'
      });
      setPermissions(response.result.permissions);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (error) => {
    const errorMessage = error.result?.error?.message || error.message;
    setError(`Erreur: ${errorMessage}`);
    console.error('Drive error:', {
      timestamp: new Date(),
      error: errorMessage,
      stack: error.stack
    });
  };

  const loadDriveFiles = async () => {
    try {
      setIsLoading(true);
      const response = await window.gapi.client.drive.files.list({
        pageSize: 30,
        fields: 'files(id, name, mimeType, modifiedTime, size, parents, capabilities, properties)',
        orderBy: 'modifiedTime desc'
      });

      const files = response.result.files;
      localStorage.setItem('driveCache', JSON.stringify(files));
      setFiles(files);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileCategory = (file) => {
    if (file.properties?.type === 'AAP') return 'Appel à Projets';
    if (file.properties?.type === 'AO') return 'Appel d\'Offres';
    return 'Autre';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-6 w-6" />
          Gestionnaire Drive
          {syncStatus === 'syncing' && (
            <RefreshCcw className="h-4 w-4 animate-spin text-blue-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCcw className="h-4 w-4 animate-spin" />
              ) : (
                'Connexion Drive'
              )}
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              {Object.keys(permissions).length} utilisateurs
              <Lock className="h-4 w-4 ml-2" />
              Permissions actives
            </div>
          </div>

          <div className="divide-y rounded-lg border">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                {file.mimeType.includes('folder') ? (
                  <Folder className="h-5 w-5 text-blue-600" />
                ) : (
                  <File className="h-5 w-5 text-gray-600" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{getFileCategory(file)}</span>
                    <span>•</span>
                    <span>Modifié le {new Date(file.modifiedTime).toLocaleDateString()}</span>
                  </div>
                </div>
                {file.capabilities?.canEdit && (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                    Éditable
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedDriveManager;