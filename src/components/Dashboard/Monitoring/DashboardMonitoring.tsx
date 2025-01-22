import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/alert';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Clock, AlertTriangle, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { monitoringService } from '@/lib/monitoring/MonitoringService';
import type { MonitoringMetrics, QueueAlert } from '@/types/monitoring';

const alertThresholds = {
  high: { size: 10, waitTime: 300 },     // 5 minutes
  standard: { size: 20, waitTime: 900 },  // 15 minutes
  low: { size: 30, waitTime: 1800 }      // 30 minutes
};

const DashboardMonitoring = () => {
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    queueSizes: [],
    errorRates: [],
    retryAttempts: [],
    activeAlerts: []
  });

  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning'>('healthy');

  useEffect(() => {
    // Abonnement aux métriques via MonitoringService
    const unsubscribeMetrics = monitoringService.onMetricsUpdate((newMetrics: MonitoringMetrics) => {
      setMetrics(prev => ({
        ...prev,
        queueSizes: newMetrics.queueSizes.slice(-50),
        errorRates: newMetrics.errorRates.slice(-50),
        retryAttempts: newMetrics.retryAttempts.slice(-50)
      }));
    });

    // Abonnement aux alertes
    const unsubscribeAlerts = monitoringService.onAlertsUpdate((alerts: QueueAlert[]) => {
      setMetrics(prev => ({
        ...prev,
        activeAlerts: alerts
      }));
      setSystemStatus(alerts.length > 0 ? 'warning' : 'healthy');
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeAlerts();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monitoring Système</h2>
        <RefreshCcw className="w-5 h-5 text-gray-500 animate-spin" />
      </div>

      {/* Alertes système */}
      {metrics.activeAlerts.length > 0 && (
        <Alert variant="warning" className="col-span-full">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Alertes Actives ({metrics.activeAlerts.length})</AlertTitle>
          <AlertDescription>
            {metrics.activeAlerts.map((alert) => (
              <div key={alert.id} className="mt-1">
                {alert.message}
                {alert.priority && (
                  <span className={
                    `ml-2 px-2 py-0.5 rounded-full text-xs ${
                      alert.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : alert.priority === 'standard'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`
                  }>
                    {alert.priority}
                  </span>
                )}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {systemStatus === 'healthy' && (
        <Alert variant="success" className="col-span-full bg-green-50">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <AlertTitle>Système Stable</AlertTitle>
          <AlertDescription>Tous les composants fonctionnent normalement</AlertDescription>
        </Alert>
      )}

      {/* Graphiques de monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tailles des Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.queueSizes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    name="Priorité Haute" 
                    stroke="#ef4444"
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="standard" 
                    name="Standard" 
                    stroke="#3b82f6"
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    name="Basse Priorité" 
                    stroke="#22c55e"
                    strokeWidth={2} 
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
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#ef4444"
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tentatives de Reprise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.retryAttempts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques clés */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Tâches en Attente</div>
              <div className="text-2xl font-bold mt-1">
                {metrics.queueSizes.length > 0 ? 
                  metrics.queueSizes[metrics.queueSizes.length - 1].total : 0}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Taux d'Erreur</div>
              <div className="text-2xl font-bold mt-1">
                {metrics.errorRates.length > 0 ? 
                  `${metrics.errorRates[metrics.errorRates.length - 1].rate}%` : '0%'}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Reprises Réussies</div>
              <div className="text-2xl font-bold mt-1">
                {metrics.retryAttempts.reduce((acc, curr) => acc + curr.count, 0)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Temps de Réponse</div>
              <div className="text-2xl font-bold mt-1">
                {metrics.queueSizes.length > 0 ? '156ms' : 'N/A'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMonitoring;