import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History, RotateCcw, Save, AlertTriangle, RefreshCw, Check } from 'lucide-react';
import DriveCore from '@/components/Drive/Core/DriveCore';
import DriveSync from '@/components/Drive/Core/DriveSync';
import { PermissionManager } from '@/core/permissions/PermissionManager';
import { CacheManager, CachePriority } from '@/cache/CacheManager';

// Type definitions
interface Version {
  id: string;
  filename: string;
  version: string;
  lastModified: string;
  author: string;
  status: 'current' | 'archived';
  metadata?: Record<string, unknown>;
}

interface VersionOperation {
  type: 'CREATE' | 'RESTORE';
  data: Partial<Version>;
  timestamp: number;
}

const VersionManager: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('synced');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeVersions = async () => {
      try {
        setSyncStatus('syncing');
        
        // Vérifier les permissions
        const hasAccess = await PermissionManager.checkPermission('version.read');
        if (!hasAccess) {
          throw new Error('Permissions insuffisantes');
        }

        // Vérifier le cache d'abord
        const cachedVersions = await CacheManager.get('versions', CachePriority.HIGH);
        if (cachedVersions) {
          setVersions(cachedVersions);
          setSyncStatus('synced');
          return;
        }

        // Si pas en cache, récupérer de Drive
        const driveVersions = await DriveCore.listVersions();
        await CacheManager.set('versions', driveVersions, CachePriority.HIGH);
        setVersions(driveVersions);
        setSyncStatus('synced');

      } catch (err) {
        setError(err.message || 'Erreur de synchronisation avec Google Drive');
        setSyncStatus('error');
      }
    };

    initializeVersions();
  }, []);

  const handleRestoreVersion = async (versionId: string) => {
    try {
      setSyncStatus('syncing');

      // Vérifier les permissions
      const hasAccess = await PermissionManager.checkPermission('version.restore');
      if (!hasAccess) {
        throw new Error('Permissions insuffisantes pour restaurer');
      }

      const operation: VersionOperation = {
        type: 'RESTORE',
        data: { id: versionId },
        timestamp: Date.now()
      };

      // Ajouter l'opération à la queue de sync
      await DriveSync.addToQueue({
        type: 'VERSION_RESTORE',
        data: operation
      });

      // Mettre à jour l'état local
      setVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          status: v.id === versionId ? 'current' : 'archived'
        }))
      );

      // Mettre à jour le cache
      await CacheManager.set('versions', versions, CachePriority.HIGH);
      
      setSyncStatus('synced');
    } catch (err) {
      setError(err.message || 'Erreur lors de la restauration de la version');
      setSyncStatus('error');
    }
  };

  const handleCreateVersion = async () => {
    try {
      setSyncStatus('syncing');

      // Vérifier les permissions
      const hasAccess = await PermissionManager.checkPermission('version.create');
      if (!hasAccess) {
        throw new Error('Permissions insuffisantes pour créer');
      }

      const newVersion: Version = {
        id: `v${versions.length + 1}`,
        filename: "Dossier_AO_2024.docx",
        version: `1.${versions.length}`,
        lastModified: new Date().toLocaleString(),
        author: await DriveCore.getCurrentUser(),
        status: "current"
      };

      const operation: VersionOperation = {
        type: 'CREATE',
        data: newVersion,
        timestamp: Date.now()
      };

      // Ajouter l'opération à la queue de sync
      await DriveSync.addToQueue({
        type: 'VERSION_CREATE',
        data: operation
      });

      // Mettre à jour l'état local
      setVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          status: 'archived'
        })).concat(newVersion)
      );

      // Mettre à jour le cache
      await CacheManager.set('versions', versions, CachePriority.HIGH);
      
      setSyncStatus('synced');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la version');
      setSyncStatus('error');
    }
  };

  // Surveiller le statut de synchronisation
  useEffect(() => {
    const monitorSync = async () => {
      const status = await DriveSync.getStatus();
      if (status.currentOperation?.includes('VERSION_')) {
        setSyncStatus('syncing');
      }
    };

    const interval = setInterval(monitorSync, 1000);
    return () => clearInterval(interval);
  }, []);

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