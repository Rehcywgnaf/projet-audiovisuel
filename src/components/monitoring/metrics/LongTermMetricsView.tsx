import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { longTermMetrics } from '@/components/monitoring/core/metrics';
import type { MetricDataPoint } from '@/components/monitoring/types/metrics.types';

interface Props {
  metricName: string;
  title: string;
  refreshInterval?: number;
}

const LongTermMetricsView: React.FC<Props> = ({ 
  metricName, 
  title, 
  refreshInterval = 60000 // 1 minute par défaut
}) => {
  const [activeTab, setActiveTab] = useState<'hour' | 'day' | 'week'>('hour');
  const [data, setData] = useState<MetricDataPoint[]>([]);
  const [trends, setTrends] = useState({
    current: 0,
    hourlyAverage: 0,
    dailyAverage: 0,
    weeklyAverage: 0
  });
  
  useEffect(() => {
    const updateData = () => {
      const historicalData = longTermMetrics.getHistoricalData(metricName, activeTab);
      const metricTrends = longTermMetrics.getMetricTrends(metricName);
      
      setData(historicalData);
      setTrends(metricTrends);
    };

    // Mise à jour initiale
    updateData();
    
    // Rafraîchissement périodique
    const interval = setInterval(updateData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [metricName, activeTab, refreshInterval]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="mb-4">
            <TabsTrigger value="hour">Heure</TabsTrigger>
            <TabsTrigger value="day">Jour</TabsTrigger>
            <TabsTrigger value="week">Semaine</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-gray-500">Actuel</div>
                  <div className="text-2xl font-bold mt-2">{trends.current.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-gray-500">Moy. Horaire</div>
                  <div className="text-2xl font-bold mt-2">{trends.hourlyAverage.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-gray-500">Moy. Journalière</div>
                  <div className="text-2xl font-bold mt-2">{trends.dailyAverage.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-gray-500">Moy. Hebdomadaire</div>
                  <div className="text-2xl font-bold mt-2">{trends.weeklyAverage.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      switch(activeTab) {
                        case 'hour':
                          return date.toLocaleTimeString();
                        case 'day':
                          return `${date.getHours()}:00`;
                        case 'week':
                          return date.toLocaleDateString();
                      }
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: any) => [value.toFixed(2), 'Valeur']}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LongTermMetricsView;