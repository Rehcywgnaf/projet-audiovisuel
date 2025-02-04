'use client';

/**
 * @file DriveIntegration.tsx
 * @description Point d'entrée unifié pour l'intégration Google Drive.
 * Gère la synchronisation bidirectionnelle, le cache intelligent et l'intégration IA.
 * 
 * Métriques cibles :
 * - Cache hit rate : 98%
 * - Temps de validation : 150-200ms
 * - Latence synchronisation : <500ms
 * 
 * @version 1.0.0
 * @since 2025-01-27
 */

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Loader2, CloudOff, CheckCircle, AlertTriangle } from 'lucide-react';
import DriveCore from '../Core/DriveCore';
import AIServiceManager from '../../../lib/AIServiceManager';

// Types
interface SyncStatus {
  status: 'idle' | 'syncing' | 'error' | 'success';
  message?: string;
  lastSync?: Date;
}

interface CacheMetrics {
  hitRate: number;
  size: number;
  lastCleared: Date;
}

interface DriveIntegrationProps {
  onSyncComplete?: () => void;
  onError?: (error: Error) => void;
}

// Composant principal
const DriveIntegration: React.FC<DriveIntegrationProps> = ({ 
  onSyncComplete, 
  onError 
}) => {
  // États
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ 
    status: 'idle' 
  });
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics>({
    hitRate: 0,
    size: 0,
    lastCleared: new Date()
  });

  // Instances
  const driveCore = DriveCore.getInstance();
  const aiService = AIServiceManager.getInstance();

  // Gestion de la synchronisation
  const handleSync = async () => {
    try {
      setSyncStatus({ status: 'syncing' });
      
      // Synchronisation Drive
      await driveCore.sync();
      
      // Validation IA des documents
      const validationResult = await aiService.processRequest(
        'validator',
        'validate_sync',
        { priority: 'medium' }
      );
      
      setSyncStatus({ 
        status: 'success',
        lastSync: new Date(),
        message: validationResult.success ? 'Synchronisation validée' : 'Synchronisation terminée'
      });
      
      onSyncComplete?.();
    } catch (error) {
      setSyncStatus({ 
        status: 'error',
        message: error.message 
      });
      onError?.(error);
    }
  };

  // Monitoring des métriques du cache
  useEffect(() => {
    const updateMetrics = async () => {
      const driveMetrics = await driveCore.getCacheMetrics();
      const aiMetrics = await aiService.getStats('validator');
      
      setCacheMetrics({
        hitRate: (driveMetrics.hitRate + (aiMetrics?.cacheHits || 0)) / 2,
        size: driveMetrics.size,
        lastCleared: driveMetrics.lastCleared
      });
    };

    const interval = setInterval(updateMetrics, 60000); // Mise à jour toutes les minutes
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  // Rendu des états de synchronisation
  const renderSyncStatus = () => {
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
              {syncStatus.message}
              {syncStatus.lastSync && 
                ` (${syncStatus.lastSync.toLocaleTimeString()})`}
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
                  {cacheMetrics.lastCleared.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriveIntegration;