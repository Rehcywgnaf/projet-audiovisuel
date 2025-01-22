import React, { useState } from 'react';
import { AlertTriangle, Bell, XCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ErrorHandling = () => {
  const [errorStatus, setErrorStatus] = useState({
    activeAlerts: [
      {
        id: 1,
        type: 'error',
        title: 'Échec de synchronisation',
        message: 'La synchronisation avec Google Drive a échoué',
        timestamp: '2024-01-26 10:35',
        retries: 2,
        status: 'active'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Permissions non appliquées',
        message: 'Certaines permissions n\'ont pas pu être mises à jour',
        timestamp: '2024-01-26 10:30',
        retries: 1,
        status: 'active'
      }
    ],
    notifications: {
      email: true,
      dashboard: true,
      slack: false
    },
    autoRetry: {
      enabled: true,
      maxAttempts: 3,
      interval: 5
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion des Erreurs</h2>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {errorStatus.activeAlerts.length} alertes actives
          </span>
        </div>
      </div>

      {/* Alertes actives */}
      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertTitle>Système de monitoring actif</AlertTitle>
        <AlertDescription>
          Surveillance en temps réel des erreurs et anomalies
        </AlertDescription>
      </Alert>

      {/* Liste des alertes actives */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Alertes actives</h3>
        </div>
        <div className="divide-y">
          {errorStatus.activeAlerts.map((alert) => (
            <div key={alert.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {alert.type === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-gray-500">{alert.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{alert.timestamp}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-gray-600">
                  Tentatives: {alert.retries}/{errorStatus.autoRetry.maxAttempts}
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration des notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Configuration des notifications</h3>
        <div className="space-y-4">
          {Object.entries(errorStatus.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="capitalize">{key}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={() => {}}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-retry configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Configuration auto-retry</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={errorStatus.autoRetry.enabled}
              onChange={() => {}}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Max tentatives</span>
            <input
              type="number"
              value={errorStatus.autoRetry.maxAttempts}
              onChange={() => {}}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Interval (minutes)</span>
            <input
              type="number"
              value={errorStatus.autoRetry.interval}
              onChange={() => {}}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandling;
