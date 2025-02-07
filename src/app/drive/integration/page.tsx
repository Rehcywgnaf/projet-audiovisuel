'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CloudOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { useDrive } from '../provider/page';

interface SyncStatus {
  status: 'idle' | 'syncing' | 'error' | 'success';
  message?: string;
  lastSync?: string;
  nextSync?: string;
}

interface CacheMetrics {
  size: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
}

export default function DriveIntegrationPage() {
  const { isAuthenticated } = useDrive();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ status: 'idle' });
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics>({
    size: 0,
    lowPriority: 0,
    mediumPriority: 0,
    highPriority: 0
  });

  // Mise à jour du statut de synchronisation
  useEffect(() => {
    let syncInterval: NodeJS.Timeout | null = null;

    const updateSyncStatus = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch('/api/drive/sync/status');
        if (!response.ok) throw new Error('Erreur de récupération du statut');
        
        const status = await response.json();
        setSyncStatus(status);
      } catch (error) {
        setSyncStatus({
          status: 'error',
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    };

    // Initial update
    updateSyncStatus();

    // Start interval only once
    if (isAuthenticated && !syncInterval) {
      syncInterval = setInterval(updateSyncStatus, 5000);
    }

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
      }
    };
  }, [isAuthenticated]);

  // Mise à jour des métriques du cache
  useEffect(() => {
    let metricsInterval: NodeJS.Timeout | null = null;
    
    const updateMetrics = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch('/api/drive/metrics');
        if (!response.ok) throw new Error('Erreur de récupération des métriques');
        
        const metrics = await response.json();
        setCacheMetrics(metrics);
      } catch (error) {
        console.error('Erreur métriques:', error);
      }
    };

    // Initial update
    updateMetrics();

    // Start interval only once
    if (isAuthenticated && !metricsInterval) {
      metricsInterval = setInterval(updateMetrics, 60000);
    }

    return () => {
      if (metricsInterval) {
        clearInterval(metricsInterval);
        metricsInterval = null;
      }
    };
  }, [isAuthenticated]);

  const renderSyncStatus = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <CloudOff className="h-4 w-4" />
          <span>Non connecté</span>
        </div>
      );
    }

    switch (syncStatus.status) {
      case 'syncing':
        return (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            <span>Synchronisation en cours...</span>
          </div>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {syncStatus.message || 'Erreur de synchronisation'}
            </AlertDescription>
          </Alert>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>
              {`Dernière synchronisation : ${new Date(syncStatus.lastSync || '').toLocaleTimeString()}`}
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <CloudOff className="h-4 w-4" />
            <span>En attente de synchronisation</span>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intégration Google Drive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500">
            Veuillez vous connecter pour accéder à l'intégration Drive
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intégration Google Drive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* État de la synchronisation */}
            <div className="p-4 bg-gray-50 rounded-lg">
              {renderSyncStatus()}
            </div>

            {/* Métriques du cache */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Total Cache</div>
                <div className="text-xl font-semibold">
                  {cacheMetrics.size} items
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Priorité Haute</div>
                <div className="text-xl font-semibold">
                  {cacheMetrics.highPriority} items
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Priorité Moyenne</div>
                <div className="text-xl font-semibold">
                  {cacheMetrics.mediumPriority} items
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}