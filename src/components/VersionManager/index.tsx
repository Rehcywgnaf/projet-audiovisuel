import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History, RotateCcw, Save, AlertTriangle, RefreshCw, Check } from 'lucide-react';

const VersionManager = () => {
  const [versions, setVersions] = useState([]);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [error, setError] = useState(null);

  // Simuler l'initialisation de Google Drive
  useEffect(() => {
    const initializeDrive = async () => {
      try {
        setSyncStatus('syncing');
        // Simulation d'un appel à l'API Google Drive
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockVersions = [
          {
            id: 'v1',
            filename: "Dossier_AO_2024.docx",
            version: "1.0",
            lastModified: "2024-01-26 10:30",
            author: "Marie Martin",
            status: "archived"
          },
          {
            id: 'v2',
            filename: "Dossier_AO_2024.docx",
            version: "1.1",
            lastModified: "2024-01-26 14:30",
            author: "Pierre Dubois",
            status: "archived"
          },
          {
            id: 'v3',
            filename: "Dossier_AO_2024.docx",
            version: "1.2",
            lastModified: "2024-01-27 09:15",
            author: "Marie Martin",
            status: "current"
          }
        ];

        setVersions(mockVersions);
        setSyncStatus('synced');
      } catch (err) {
        setError('Erreur de synchronisation avec Google Drive');
        setSyncStatus('error');
      }
    };

    initializeDrive();
  }, []);

  const handleRestoreVersion = async (versionId) => {
    try {
      setSyncStatus('syncing');
      // Simulation de la restauration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          status: v.id === versionId ? 'current' : 'archived'
        }))
      );
      
      setSyncStatus('synced');
    } catch (err) {
      setError('Erreur lors de la restauration de la version');
      setSyncStatus('error');
    }
  };

  const handleCreateVersion = async () => {
    try {
      setSyncStatus('syncing');
      // Simulation de la création d'une nouvelle version
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVersion = {
        id: `v${versions.length + 1}`,
        filename: "Dossier_AO_2024.docx",
        version: `1.${versions.length}`,
        lastModified: new Date().toLocaleString(),
        author: "Marie Martin",
        status: "current"
      };

      setVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          status: 'archived'
        })).concat(newVersion)
      );
      
      setSyncStatus('synced');
    } catch (err) {
      setError('Erreur lors de la création de la version');
      setSyncStatus('error');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <History className="w-6 h-6" />
              Gestionnaire de Versions
            </CardTitle>
            <div className="flex items-center gap-2">
              {syncStatus === 'syncing' && (
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              )}
              {syncStatus === 'synced' && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {syncStatus === 'error' && (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {versions.map((version) => (
              <div 
                key={version.id} 
                className={`border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow ${
                  version.status === 'current' ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div>
                  <h3 className="font-medium">{version.filename}</h3>
                  <p className="text-sm text-gray-500">
                    Version {version.version} • Modifié le {version.lastModified} • par {version.author}
                  </p>
                  {version.status === 'current' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1 inline-block">
                      Version courante
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {version.status !== 'current' && (
                    <button 
                      onClick={() => handleRestoreVersion(version.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Restaurer cette version"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCreateVersion}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Créer nouvelle version
              </button>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">
                Les versions sont automatiquement synchronisées avec Google Drive.
                {syncStatus === 'syncing' && " Synchronisation en cours..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VersionManager;