import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Rocket, Server, Users, Clock, AlertTriangle } from 'lucide-react';

export default function BetaDeployment() {
  const [deploymentState, setDeploymentState] = useState({
    stage: 'prepare',
    progress: 0,
    modules: {
      rss: { status: 'pending', users: 0 },
      drive: { status: 'pending', users: 0 },
      alerts: { status: 'pending', users: 0 },
      tracking: { status: 'pending', users: 0 },
      analytics: { status: 'pending', users: 0 }
    }
  });

  const startDeployment = async () => {
    setDeploymentState(prev => ({
      ...prev,
      stage: 'deploy',
      progress: 10
    }));

    // Simuler le déploiement des modules
    for (const module in deploymentState.modules) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDeploymentState(prev => ({
        ...prev,
        progress: prev.progress + 15,
        modules: {
          ...prev.modules,
          [module]: { 
            ...prev.modules[module],
            status: 'success',
            users: Math.floor(Math.random() * 50) + 10
          }
        }
      }));
    }

    setDeploymentState(prev => ({
      ...prev,
      stage: 'monitor',
      progress: 100
    }));
  };

  const emergencyStop = () => {
    setDeploymentState(prev => ({
      ...prev,
      stage: 'stopped',
      modules: Object.keys(prev.modules).reduce((acc, key) => ({
        ...acc,
        [key]: { ...prev.modules[key], status: 'stopped' }
      }), {})
    }));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Déploiement Bêta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${deploymentState.progress}%` }}
              />
            </div>

            {/* Modules Status */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(deploymentState.modules).map(([name, data]) => (
                <div key={name} className="p-4 border rounded bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    {name === 'rss' ? <Server className="w-4 h-4" /> :
                     name === 'drive' ? <Server className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                    <h3 className="font-medium capitalize">{name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${data.status === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
                      {data.status}
                    </span>
                    {data.users > 0 && (
                      <span className="text-sm text-blue-600 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {data.users}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={startDeployment}
                disabled={deploymentState.stage !== 'prepare'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Lancer le déploiement
              </button>
              <button
                onClick={emergencyStop}
                className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Arrêt d'urgence
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}