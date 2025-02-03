import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Activity, AlertTriangle, Database } from 'lucide-react';
import { MetricsData } from './MonitoringDashboardTypes';

// Lazy loading des composants lourds
const ChartComponent = React.lazy(() => import('./ChartComponent'));
const CacheMetrics = React.lazy(() => import('./CacheMetrics'));

// Cache pour les données
const useMetricsCache = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const CACHE_DURATION = 5000; // 5 secondes

  useEffect(() => {
    const fetchMetrics = async () => {
      const currentTime = Date.now();
      if (lastUpdate && currentTime - lastUpdate < CACHE_DURATION) {
        return;
      }

      const newMetrics: MetricsData = {
        validation: {
          avgTime: Math.floor(Math.random() * 50 + 150),
          threshold: 200,
          history: Array(20).fill(null).map((_, i) => ({
            time: i,
            value: Math.random() * 50 + 150
          }))
        },
        cache: {
          rssHitRate: Math.floor(Math.random() * 5 + 95),
          aiEditorHitRate: Math.floor(Math.random() * 3 + 97),
          docValidationHitRate: Math.floor(Math.random() * 5 + 95),
          templatesHitRate: Math.floor(Math.random() * 2 + 98)
        },
        alerts: [
          {
            type: 'warning',
            message: 'Validation time spike detected',
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };

      setMetrics(newMetrics);
      setLastUpdate(currentTime);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return metrics;
};

interface AlertSectionProps {
  alerts: MetricsData['alerts'];
}

const AlertSection = React.memo(({ alerts }: AlertSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Alertes Système
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
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
));

const LoadingComponent = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const OptimizedDashboard = () => {
  const metrics = useMetricsCache();

  const chartProps = useMemo(() => ({
    data: metrics?.validation.history || [],
    avgTime: metrics?.validation.avgTime
  }), [metrics?.validation]);

  const cacheProps = useMemo(() => ({
    components: [
      { name: 'RSS-IA', rate: metrics?.cache.rssHitRate, target: 95, duration: '1h' },
      { name: 'AI Editor', rate: metrics?.cache.aiEditorHitRate, target: 98, duration: '2min' },
      { name: 'Doc Validation', rate: metrics?.cache.docValidationHitRate, target: 95, duration: '10min' },
      { name: 'Templates', rate: metrics?.cache.templatesHitRate, target: 99, duration: '24h' }
    ]
  }), [metrics?.cache]);

  if (!metrics) {
    return <LoadingComponent />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingComponent />}>
          <ChartComponent {...chartProps} />
          <CacheMetrics {...cacheProps} />
        </Suspense>
      </div>

      <AlertSection alerts={metrics.alerts} />
    </div>
  );
};

export default OptimizedDashboard;