import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, AlertTriangle } from 'lucide-react';

import { validateDriveOperation } from '@/lib/drive/permissions/core';
import { permissionCache } from '@/lib/drive/permissions/cache';

const DrivePermissionsUI = () => {
  const [alerts, setAlerts] = useState([]);
  const [cacheStats, setCacheStats] = useState({ size: 0 });

  useEffect(() => {
    const updateCacheStats = () => {
      setCacheStats({
        size: permissionCache.getSize()
      });
    };

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePermissionAlert = (message, type = 'info') => {
    setAlerts(prev => [{ message, type }, ...prev].slice(0, 5));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Statut des Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Cache
            </h3>
            <div className="mt-2 text-sm">
              Entrées en cache: {cacheStats.size}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertes Récentes
            </h3>
            <div className="space-y-2 mt-2">
              {alerts.map((alert, index) => (
                <Alert key={index} variant={alert.type}>
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrivePermissionsUI;