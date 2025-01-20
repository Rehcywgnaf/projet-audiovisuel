import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Monitor, Activity } from 'lucide-react';

const DashboardMonitoring = () => {
  const [stats] = useState({
    activeUsers: 12,
    averageResponseTime: '1.2s',
    errorRate: '0.5%',
    uptime: '99.9%'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-6 h-6" />
          Monitoring Système
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Utilisateurs Actifs</h3>
            <p className="text-2xl font-bold mt-1">{stats.activeUsers}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Temps de Réponse Moyen</h3>
            <p className="text-2xl font-bold mt-1">{stats.averageResponseTime}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Taux d'Erreur</h3>
            <p className="text-2xl font-bold mt-1">{stats.errorRate}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
            <p className="text-2xl font-bold mt-1">{stats.uptime}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700">Tous les systèmes opérationnels</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMonitoring;