import React, { useState, useEffect, useCallback } from 'react';
import { Clock, RotateCw, Activity, Calendar, Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { DriveSync } from '../Core/DriveSync';

interface SyncLog {
  id: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}

interface SyncSettings {
  autoSync: boolean;
  syncInterval: number;
  syncVersions: boolean;
  syncPermissions: boolean;
  syncMetadata: boolean;
}

interface SyncStatus {
  lastSync: string | null;
  nextSync: string | null;
  status: 'active' | 'inactive' | 'error';
  currentOperation: string | null;
  logs: SyncLog[];
}

const DriveSyncUI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    nextSync: null,
    status: 'inactive',
    currentOperation: null,
    logs: []
  });

  const [settings, setSettings] = useState<SyncSettings>({
    autoSync: true,
    syncInterval: 60,
    syncVersions: true,
    syncPermissions: true,
    syncMetadata: true
  });

  const driveSync = DriveSync.getInstance();

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSyncError = useCallback((error: Error) => {
    const newLog: SyncLog = {
      id: Date.now().toString(),
      timestamp: formatDateTime(new Date()),
      type: 'error',
      message: `Erreur de synchronisation: ${error.message}`
    };
    
    setSyncStatus(prev => ({
      ...prev,
      status: 'error',
      logs: [newLog, ...prev.logs].slice(0, 50)
    }));
  }, []);

  const updateSyncStatus = useCallback((operation: string) => {
    const now = new Date();
    const nextSync = new Date(now.getTime() + settings.syncInterval * 60000);

    setSyncStatus(prev => ({
      ...prev,
      lastSync: formatDateTime(now),
      nextSync: formatDateTime(nextSync),
      currentOperation: operation,
      status: 'active',
      logs: [{
        id: Date.now().toString(),
        timestamp: formatDateTime(now),
        type: 'success',
        message: `Synchronisation ${operation} réussie`
      }, ...prev.logs].slice(0, 50)
    }));
  }, [settings.syncInterval]);

  const handleSyncNow = async () => {
    try {
      setSyncStatus(prev => ({ ...prev, status: 'active', currentOperation: 'complète' }));
      
      await driveSync.addToQueue({
        type: 'FULL_SYNC',
        settings: {
          includeVersions: settings.syncVersions,
          includePermissions: settings.syncPermissions,
          includeMetadata: settings.syncMetadata
        }
      });

      updateSyncStatus('complète');
    } catch (error) {
      handleSyncError(error instanceof Error ? error : new Error('Erreur inconnue'));
    }
  };

  const toggleSetting = (setting: keyof SyncSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  useEffect(() => {
    const initializeSync = async () => {
      try {
        const status = await driveSync.getStatus();
        setSyncStatus(prevStatus => ({
          ...prevStatus,
          ...status
        }));
      } catch (error) {
        handleSyncError(error instanceof Error ? error : new Error('Erreur d\'initialisation'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeSync();

    const syncInterval = settings.autoSync ? 
      setInterval(handleSyncNow, settings.syncInterval * 60000) : 
      null;

    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [settings.autoSync, settings.syncInterval]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Synchronisation Drive</h2>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Prochaine synchro: {syncStatus.nextSync || 'Non planifiée'}
          </span>
        </div>
      </div>

      <Alert variant={syncStatus.status === 'error' ? 'destructive' : 'default'}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {syncStatus.status === 'active' ? 'Synchronisation en cours' : 
           syncStatus.status === 'error' ? 'Erreur de synchronisation' : 
           'Synchronisation inactive'}
        </AlertTitle>
        <AlertDescription>
          {syncStatus.lastSync ? 
            `Dernière synchronisation : ${syncStatus.lastSync}` : 
            'Aucune synchronisation effectuée'}
          {syncStatus.currentOperation && ` - Opération: ${syncStatus.currentOperation}`}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres de synchronisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Synchronisation automatique</h4>
              <p className="text-sm text-gray-500">
                Toutes les {settings.syncInterval} minutes
              </p>
            </div>
            <Switch
              checked={settings.autoSync}
              onCheckedChange={() => toggleSetting('autoSync')}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <span>Synchroniser les versions</span>
              </label>
              <Switch
                checked={settings.syncVersions}
                onCheckedChange={() => toggleSetting('syncVersions')}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <span>Synchroniser les permissions</span>
              </label>
              <Switch
                checked={settings.syncPermissions}
                onCheckedChange={() => toggleSetting('syncPermissions')}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <span>Synchroniser les métadonnées</span>
              </label>
              <Switch
                checked={settings.syncMetadata}
                onCheckedChange={() => toggleSetting('syncMetadata')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique de synchronisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syncStatus.logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
              >
                <div className={`
                  w-2 h-2 mt-2 rounded-full flex-shrink-0
                  ${log.type === 'success' ? 'bg-green-500' : 
                    log.type === 'warning' ? 'bg-yellow-500' : 
                    'bg-red-500'}
                `} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {log.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {log.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {/* Ouvrir modal de planification */}}
        >
          <Calendar className="w-4 h-4" />
          <span>Planifier</span>
        </Button>

        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={handleSyncNow}
          disabled={syncStatus.status === 'active'}
        >
          <RotateCw className={`w-4 h-4 ${
            syncStatus.status === 'active' ? 'animate-spin' : ''
          }`} />
          <span>
            {syncStatus.status === 'active' ? 
              'Synchronisation...' : 
              'Synchroniser maintenant'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default DriveSyncUI;