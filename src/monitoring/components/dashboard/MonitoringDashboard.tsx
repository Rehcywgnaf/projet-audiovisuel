import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Clock, Database } from 'lucide-react';

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState({
    validation: {
      avgTime: 175,
      threshold: 200,
      history: Array(20).fill(null).map((_, i) => ({
        time: i,
        value: Math.random() * 50 + 150
      }))
    },
    cache: {
      rssHitRate: 95,
      aiEditorHitRate: 98,
      docValidationHitRate: 95,
      templatesHitRate: 99
    },
    alerts: [
      {
        type: 'warning',
        message: 'Validation time spike detected',
        timestamp: '10:45:23'
      }
    ]
  });

  const cacheComponents = [
    { name: 'RSS-IA', rate: metrics.cache.rssHitRate, target: 95, duration: '1h' },
    { name: 'AI Editor', rate: metrics.cache.aiEditorHitRate, target: 98, duration: '2min' },
    { name: 'Doc Validation', rate: metrics.cache.docValidationHitRate, target: 95, duration: '10min' },
    { name: 'Templates', rate: metrics.cache.templatesHitRate, target: 99, duration: '24h' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Temps de Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.validation.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[100, 250]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">
                {metrics.validation.avgTime}ms
              </div>
              <div className="text-sm text-gray-500">
                Temps moyen de validation
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Performance Cache
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cacheComponents.map((component, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{component.name}</span>
                    <span className="text-gray-500">{component.duration}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${component.rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hit Rate</span>
                    <span className={component.rate >= component.target ? 'text-green-600' : 'text-yellow-600'}>
                      {component.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alertes Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.alerts.map((alert, index) => (
              <Alert key={index} variant={alert.type}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Alerte Performance</AlertTitle>
                <AlertDescription className="flex justify-between">
                  <span>{alert.message}</span>
                  <span className="text-sm text-gray-500">{alert.timestamp}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringDashboard;