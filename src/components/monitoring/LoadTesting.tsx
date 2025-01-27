import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';

const LoadTesting = () => {
  const [testStatus, setTestStatus] = useState({
    running: false,
    currentScenario: null,
    results: {}
  });

  const testScenarios = [
    {
      id: 'validation-burst',
      name: 'Validation Documents en Masse',
      description: '50 documents simultanés',
      config: {
        concurrent: 50,
        duration: 60,
        type: 'validation'
      },
      thresholds: {
        responseTime: 200,
        errorRate: 1,
        cpuUsage: 80
      }
    },
    {
      id: 'ai-generation',
      name: 'Génération IA Intensive',
      description: '20 requêtes/minute',
      config: {
        rps: 20,
        duration: 300,
        type: 'ai-generation'
      },
      thresholds: {
        responseTime: 1000,
        errorRate: 2,
        memoryUsage: 85
      }
    },
    {
      id: 'cache-update',
      name: 'Mise à jour Cache',
      description: '100 entrées simultanées',
      config: {
        entries: 100,
        duration: 30,
        type: 'cache'
      },
      thresholds: {
        hitRate: 95,
        syncTime: 500,
        diskUsage: 70
      }
    },
    {
      id: 'read-intensive',
      name: 'Lecture Intensive',
      description: '200 requêtes/minute',
      config: {
        rps: 200,
        duration: 600,
        type: 'read'
      },
      thresholds: {
        responseTime: 100,
        errorRate: 0.5,
        cacheHitRate: 98
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testScenarios.map((scenario) => (
          <Card key={scenario.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {scenario.name}
                  {testStatus.running && testStatus.currentScenario === scenario.id && (
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </span>
                <button
                  className={`p-2 rounded-full ${
                    testStatus.running && testStatus.currentScenario === scenario.id
                      ? 'bg-red-100 hover:bg-red-200 text-red-700'
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  }`}
                  onClick={() => {
                    if (testStatus.running && testStatus.currentScenario === scenario.id) {
                      setTestStatus({ ...testStatus, running: false, currentScenario: null });
                    } else {
                      setTestStatus({
                        ...testStatus,
                        running: true,
                        currentScenario: scenario.id
                      });
                    }
                  }}
                >
                  {testStatus.running && testStatus.currentScenario === scenario.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">{scenario.description}</div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Configuration:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(scenario.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Seuils:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(scenario.thresholds).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {testStatus.results[scenario.id] && (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <div className="ml-2">
                      <div className="font-medium">Résultats du Test</div>
                      <div className="text-sm text-gray-600">
                        {JSON.stringify(testStatus.results[scenario.id], null, 2)}
                      </div>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoadTesting;