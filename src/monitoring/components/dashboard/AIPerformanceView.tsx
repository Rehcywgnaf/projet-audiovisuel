import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Zap, Database, RefreshCw } from 'lucide-react';

const AIPerformanceView = () => {
  const [data, setData] = useState({
    rss: {
      hitRate: 95,
      responseTime: 200,
      costPerRequest: 0.0015,
      requestsPerHour: 500
    },
    editor: {
      hitRate: 98,
      responseTime: 80,
      costPerRequest: 0.002,
      requestsPerHour: 2000
    },
    template: {
      hitRate: 99,
      responseTime: 200,
      costPerRequest: 0.001,
      requestsPerHour: 100
    },
    validation: {
      responseTime: 175,
      parallelRequests: 50,
      successRate: 99.5
    }
  });

  // Simuler des mises à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        rss: {
          ...prevData.rss,
          hitRate: Math.min(98, prevData.rss.hitRate + 0.1),
          responseTime: Math.max(150, prevData.rss.responseTime - 1)
        },
        validation: {
          ...prevData.validation,
          responseTime: Math.max(150, prevData.validation.responseTime - 0.5)
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Performance IA - Optimisations en Cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* RSS-IA Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  RSS-IA Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hit Rate</span>
                    <span className="font-medium">{data.rss.hitRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 rounded-full h-2 transition-all"
                      style={{ width: `${data.rss.hitRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Response Time</span>
                    <span>{data.rss.responseTime}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Validation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Doc Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Time</span>
                    <span className="font-medium">{data.validation.responseTime}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2 transition-all"
                      style={{ width: `${(data.validation.responseTime / 200) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Success Rate</span>
                    <span>{data.validation.successRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Cost Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>RSS-IA</span>
                    <span>${(data.rss.costPerRequest * data.rss.requestsPerHour).toFixed(2)}/h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Editor</span>
                    <span>${(data.editor.costPerRequest * data.editor.requestsPerHour).toFixed(2)}/h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Template</span>
                    <span>${(data.template.costPerRequest * data.template.requestsPerHour).toFixed(2)}/h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPerformanceView;