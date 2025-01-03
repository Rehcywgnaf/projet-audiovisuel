import React, { useState } from 'react';
import { Clock, RotateCw, Activity, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DriveSync = () => {
  const [syncStatus, setSyncStatus] = useState({
    lastSync: '2024-01-26 10:30',
    nextSync: '2024-01-26 11:30',
    status: 'active',
    interval: 60,
    logs: [
      {
        timestamp: '2024-01-26 10:30',
        type: 'success',
        message: 'Synchronisation complète réussie'
      },
      {
        timestamp: '2024-01-26 09:30',
        type: 'warning',
        message: 'Mise à jour des permissions'
      },
      {
        timestamp: '2024-01-26 08:30',
        type: 'error',
        message: 'Échec de synchronisation des versions'
      }
    ]
  });

  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncVersions: true,
    syncPermissions: true,
    syncMetadata: true
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Synchronisation Drive</h2>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Prochaine synchro: {syncStatus.nextSync}
          </span>
        </div>
      </div>

      <Alert>
        <Activity className="w-4 h-4" />
        <AlertTitle>Synchronisation {syncStatus.status === 'active' ? 'active' : 'inactive'}</AlertTitle>
        <AlertDescription>
          Dernière synchronisation : {syncStatus.lastSync}
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Paramètres</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Synchronisation automatique</p>
              <p className="text-sm text-gray-500">Toutes les {syncSettings.interval} minutes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={syncSettings.autoSync}
                onChange={() => {}}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-2">
            {Object.entries(syncSettings).slice(1).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {key.replace('sync', 'Synchroniser les ')}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Historique</h3>
        </div>
        <div className="divide-y">
          {syncStatus.logs.map((log, index) => (
            <div key={index} className="p-4 flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${log.type === 'success' ? 'bg-green-500' : log.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{log.message}</p>
                <p className="text-xs text-gray-500">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Planifier</span>
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2">
          <RotateCw className="w-4 h-4" />
          <span>Synchroniser maintenant</span>
        </button>
      </div>
    </div>
  );
};

export default DriveSync;