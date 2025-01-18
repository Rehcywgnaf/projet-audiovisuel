import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCcw, AlertTriangle, Check } from 'lucide-react';

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

const DriveMonitoring = () => {
  const [metrics, setMetrics] = useState({
    responseTime: [],
    errorRate: [],
    throughput: [],
    status: 'healthy'
  });

  // Simulation des données pour la démo
  const updateMetrics = () => {
    const now = new Date();
    setMetrics(prev => ({
      responseTime: [...prev.responseTime.slice(-10), {
        time: now.toLocaleTimeString(),
        value: Math.random() * 100 + 100
      }],
      errorRate: [...prev.errorRate.slice(-10), {
        time: now.toLocaleTimeString(),
        value: Math.random() * 2
      }],
      throughput: [...prev.throughput.slice(-10), {
        time: now.toLocaleTimeString(),
        value: Math.floor(Math.random() * 50 + 150)
      }],
      status: Math.random() > 0.9 ? 'warning' : 'healthy'
    }));
  };

  useEffect(() => {
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monitoring Drive</h2>
        <RefreshCcw className="w-5 h-5 text-gray-500 animate-spin" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.status === 'warning' && (
          <Alert className="col-span-full bg-yellow-50 border-yellow-200">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>Charge élevée détectée sur le système</AlertDescription>
          </Alert>
        )}

        {metrics.status === 'healthy' && (
          <Alert className="col-span-full bg-green-50 border-green-200">
            <Check className="w-4 h-4 text-green-600" />
            <AlertTitle>Système Stable</AlertTitle>
            <AlertDescription>Tous les indicateurs sont normaux</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Temps de Réponse (ms)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.responseTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
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
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
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
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriveMonitoring;