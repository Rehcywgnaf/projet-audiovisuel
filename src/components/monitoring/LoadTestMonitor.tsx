import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const LoadTestMonitor = () => {
  const [metrics, setMetrics] = useState({
    dailyIACost: { current: 0, target: 0.50, unit: '$/day' },
    documentValidation: { current: 0, target: 50, unit: 'docs/60s' },
    iaRequests: { current: 0, target: 20, unit: 'req/min' },
    cacheOperations: { current: 0, target: 100, unit: 'entries/30s' },
    readOperations: { current: 0, target: 200, unit: 'req/min' }
  });

  const getStatusIcon = (current, target) => {
    if (current >= target) return <CheckCircle className="text-green-500 w-5 h-5" />;
    if (current >= target * 0.8) return <Clock className="text-yellow-500 w-5 h-5" />;
    return <AlertTriangle className="text-red-500 w-5 h-5" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Tests de Charge - Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(metrics).map(([key, data]) => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                {getStatusIcon(data.current, data.target)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Actuel: {data.current} {data.unit}</span>
                  <span>Cible: {data.target} {data.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{
                      width: `${Math.min((data.current / data.target) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadTestMonitor;