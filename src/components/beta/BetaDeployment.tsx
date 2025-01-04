import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Rocket, Server, Users, Clock } from 'lucide-react';

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

  // Rest of the component code...

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
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${deploymentState.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}