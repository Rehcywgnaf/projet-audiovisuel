import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { monitoringService } from '../../index';
import type { MetricDataPoint } from '../../types/metrics.types';
import type { QueueAlert } from '../../types/queue.types';

interface DashboardMetrics {
  queueSizes: MetricDataPoint[];
  errorRates: MetricDataPoint[];
  retryAttempts: MetricDataPoint[];
  activeAlerts: QueueAlert[];
}

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    queueSizes: [],
    errorRates: [],
    retryAttempts: [],
    activeAlerts: []
  });

  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning'>('healthy');

  useEffect(() => {
    // Utilisation de notre nouveau service de métriques long terme
    const updateMetrics = () => {
      const queueSizes = monitoringService.getHistoricalData('queue_sizes', 'hour');
      const errorRates = monitoringService.getHistoricalData('error_rates', 'hour');
      const retryAttempts = monitoringService.getHistoricalData('retry_attempts', 'hour');
      const trends = monitoringService.getMetricTrends('system_health');

      setMetrics(prev => ({
        ...prev,
        queueSizes,
        errorRates,
        retryAttempts,
      }));

      setSystemStatus(trends.current > 0.8 ? 'healthy' : 'warning');
    };

    // Mise à jour initiale
    updateMetrics();
    
    // Rafraîchissement périodique
    const interval = setInterval(updateMetrics, 30000);
    
    // Abonnement aux alertes
    const unsubscribeAlerts = monitoringService.onAlertsUpdate((alerts: QueueAlert[]) => {
      setMetrics(prev => ({
        ...prev,
        activeAlerts: alerts
      }));
    });

    return () => {
      clearInterval(interval);
      unsubscribeAlerts();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monitoring Système</h2>
        <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
      </div>

      {metrics.activeAlerts.length > 0 ? (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertTitle>Alertes Actives ({metrics.activeAlerts.length})</AlertTitle>
          <AlertDescription>
            {metrics.activeAlerts.map((alert) => (
              <div key={alert.id} className="mt-1">
                {alert.message}
                <span className={`
                  ml-2 px-2 py-0.5 rounded-full text-xs
                  ${alert.priority === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : alert.priority === 'standard'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                  }
                `}>
                  {alert.priority}
                </span>
              </div>
            ))}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <AlertTitle>Système Stable</AlertTitle>
          <AlertDescription>Tous les composants fonctionnent normalement</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tailles des Files d'Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.queueSizes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Files d'attente" 
                    stroke="#3b82f6"
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux d'Erreurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.errorRates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: any) => [`${value.toFixed(2)}%`, 'Erreurs']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reprises de Tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.retryAttempts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métriques Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Tâches en Attente</div>
              <div className="text-2xl font-bold mt-1">
                {metrics.queueSizes[metrics.queueSizes.length - 1]?.value.toFixed(0) || 0}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Taux d'Erreur</div>
              <div className="text-2xl font-bold mt-1">
                {`${(metrics.errorRates[metrics.errorRates.length - 1]?.value || 0).toFixed(1)}%`}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Reprises Réussies</div>
              <div className="text-2xl font-bold mt-1">
                {metrics.retryAttempts.reduce((acc, curr) => acc + curr.value, 0)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">État Système</div>
              <div className="text-2xl font-bold mt-1">
                {systemStatus === 'healthy' ? '✅' : '⚠️'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringDashboard;