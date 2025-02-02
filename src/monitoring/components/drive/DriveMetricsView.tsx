import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { longTermMetrics } from '../../index';

const THRESHOLDS = {
  responseTime: {
    warning: 200,
    critical: 500,
    max: 1000
  },
  errorRate: {
    warning: 1,
    critical: 5,
    max: 10
  },
  throughput: {
    warning: 180,
    critical: 250
  }
};

const DriveMetricsView = () => {
  const [metrics, setMetrics] = useState({
    responseTime: [],
    errorRate: [],
    throughput: [],
    status: 'healthy'
  });

  useEffect(() => {
    const updateMetrics = () => {
      // Update avec les données long terme
      const responseTimeData = longTermMetrics.getHistoricalData('drive_response_time', 'hour');
      const errorRateData = longTermMetrics.getHistoricalData('drive_error_rate', 'hour');
      const throughputData = longTermMetrics.getHistoricalData('drive_throughput', 'hour');

      const responseTimeTrend = longTermMetrics.getMetricTrends('drive_response_time');
      const errorRateTrend = longTermMetrics.getMetricTrends('drive_error_rate');

      const status = 
        responseTimeTrend.current > THRESHOLDS.responseTime.critical ||
        errorRateTrend.current > THRESHOLDS.errorRate.critical
          ? 'warning'
          : 'healthy';

      setMetrics({
        responseTime: responseTimeData,
        errorRate: errorRateData,
        throughput: throughputData,
        status
      });
    };

    // Update initial et périodique
    updateMetrics();
    const interval = setInterval(updateMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monitoring Drive</h2>
        <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
      </div>

      {metrics.status === 'warning' ? (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            Dégradation des performances détectée
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <AlertTitle>Système Stable</AlertTitle>
          <AlertDescription>
            Tous les indicateurs sont normaux
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Temps de Réponse (ms)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.responseTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: any) => [`${value.toFixed(2)} ms`, 'Réponse']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
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
            <CardTitle>Taux d'Erreur (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.errorRate}>
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
            <CardTitle>Débit (req/min)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.throughput}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: any) => [`${value.toFixed(2)} req/min`, 'Débit']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriveMetricsView;