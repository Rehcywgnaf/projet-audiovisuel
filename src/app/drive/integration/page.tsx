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
  hitRate: number;
  size: number;
  lastCleared: string;
}

export default function DriveIntegrationPage() {
  const { isAuthenticated } = useDrive();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ status: 'idle' });
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics>({
    hitRate: 0,
    size: 0,
    lastCleared: new Date().toISOString()
  });

  // Mise à jour du statut de synchronisation
  useEffect(() => {
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

    const interval = setInterval(updateSyncStatus, 5000);
    updateSyncStatus();

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Mise à jour des métriques du cache
  useEffect(() => {
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

    const interval = setInterval(updateMetrics, 60000);
    updateMetrics();

    return () => clearInterval(interval);
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
                <div className="text-sm text-gray-500">Hit Rate</div>
                <div className="text-xl font-semibold">
                  {cacheMetrics.hitRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Cache Size</div>
                <div className="text-xl font-semibold">
                  {cacheMetrics.size} items
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Last Cleared</div>
                <div className="text-xl font-semibold">
                  {new Date(cacheMetrics.lastCleared).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}