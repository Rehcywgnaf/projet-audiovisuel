import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DriveTestExecutor from '@/components/drive/testing/DriveTestExecutor';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const DriveTestDemo = () => {
  const [testStatus, setTestStatus] = useState({
    simultaneityPassed: false,
    volumePassed: false,
    endurancePassed: false,
    peakPassed: false
  });
  
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const checkThresholds = (metrics) => {
    if (metrics.responseTime > 2000) {
      addLog('⚠️ Temps de réponse critique détecté', 'error');
    }
    if (metrics.errorRate > 0.05) {
      addLog('⚠️ Taux d'erreur critique détecté', 'error');
    }
    if (metrics.cpuUsage > 80) {
      addLog('⚠️ Utilisation CPU élevée', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test de l'Infrastructure Drive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <DriveTestExecutor 
              onMetricsUpdate={checkThresholds}
              onTestComplete={(testId, success) => {
                setTestStatus(prev => ({
                  ...prev,
                  [`${testId}Passed`]: success
                }));
                addLog(`Test ${testId} ${success ? 'réussi ✅' : 'échoué ❌'}`);
              }}
            />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Logs des Tests</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 text-sm p-2 rounded ${
                    log.type === 'error' 
                      ? 'bg-red-50 text-red-800'
                      : log.type === 'warning'
                      ? 'bg-yellow-50 text-yellow-800'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {log.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : log.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span className="text-xs font-mono">{log.timestamp}</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriveTestDemo;