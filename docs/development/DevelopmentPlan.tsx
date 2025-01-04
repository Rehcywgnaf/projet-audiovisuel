import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, ArrowRight, AlertTriangle } from 'lucide-react';

const DevelopmentPlan = () => {
  const priorities = [
    {
      level: "Priorité Immédiate",
      timeframe: "Semaine en cours",
      tasks: [
        {
          name: "IntegrationDrive",
          status: "in_progress",
          current_size: "1.9KB",
          subtasks: [
            "Finalisation intégration Google Drive",
            "Implémentation gestion permissions",
            "Ajout gestion des erreurs"
          ],
          progress: 65
        }
      ]
    },
    {
      level: "Court Terme",
      timeframe: "2 semaines",
      tasks: [
        {
          name: "TeamTracking",
          status: "early_stage",
          current_size: "222 octets",
          subtasks: [
            "Développement suivi temps réel",
            "Intégration gestion disponibilités",
            "Système de notifications d'état"
          ],
          progress: 15
        }
      ]
    },
    {
      level: "Moyen Terme",
      timeframe: "3-4 semaines",
      tasks: [
        {
          name: "TemplateManager (AO)",
          status: "in_progress",
          current_size: "2.8KB",
          subtasks: [
            "Finalisation des templates AO",
            "Système de validation",
            "Intégration avec le Drive"
          ],
          progress: 45
        },
        {
          name: "Dashboard Principal",
          status: "pending",
          current_size: "N/A",
          subtasks: [
            "Création interface principale",
            "Intégration des métriques",
            "Système de filtres"
          ],
          progress: 0
        },
        {
          name: "FeedbackSystem",
          status: "early_stage",
          current_size: "250 octets",
          subtasks: [
            "Système de collecte feedback",
            "Interface de reporting",
            "Notifications automatiques"
          ],
          progress: 10
        }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500" />;
      case 'in_progress':
        return <Clock className="text-yellow-500" />;
      case 'early_stage':
        return <AlertTriangle className="text-orange-500" />;
      default:
        return <ArrowRight className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan de Développement SAPAV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {priorities.map((priority, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{priority.level}</h2>
                  <span className="text-sm text-gray-500">{priority.timeframe}</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {priority.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className="font-medium">{task.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {task.current_size}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 rounded-full h-2"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {task.progress}% complété
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {task.subtasks.map((subtask, subtaskIndex) => (
                          <li key={subtaskIndex} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                            {subtask}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentPlan;
