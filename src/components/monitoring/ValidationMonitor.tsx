import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';

const ValidationMonitor = () => {
  const [metrics, setMetrics] = useState({
    currentLoad: {
      activeValidations: 0,
      queuedDocuments: 0,
      averageResponseTime: 0
    },
    cacheMetrics: {
      hitRate: 0,
      missRate: 0,
      preloadedDocs: 0
    },
    performance: {
      lastMinute: [],
      warnings: []
    }
  });

  const [timeRange, setTimeRange] = useState('1h');

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(current => ({
        ...current,
        currentLoad: {
          activeValidations: Math.floor(Math.random() * 10),
          queuedDocuments: Math.floor(Math.random() * 5),
          averageResponseTime: 150 + Math.random() * 50
        },
        cacheMetrics: {
          hitRate: 90 + Math.random() * 5,
          missRate: 5 + Math.random() * 5,
          preloadedDocs: 15 + Math.floor(Math.random() * 5)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performances de Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Charge Actuelle
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Validations actives</span>
                  <span>{metrics.currentLoad.activeValidations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">En attente</span>
                  <span>{metrics.currentLoad.queuedDocuments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Temps moyen</span>
                  <span>{Math.round(metrics.currentLoad.averageResponseTime)}ms</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Cache
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taux de succès</span>
                  <span>{metrics.cacheMetrics.hitRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taux d'échec</span>
                  <span>{metrics.cacheMetrics.missRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Docs préchargés</span>
                  <span>{metrics.cacheMetrics.preloadedDocs}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                État Système
              </h3>
              <div className="space-y-2">
                <div className="rounded-md bg-green-50 p-2 text-sm text-green-700">
                  Système optimisé et stable
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Cache: 10min
                </div>
              </div>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.performance.lastMinute}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationMonitor;