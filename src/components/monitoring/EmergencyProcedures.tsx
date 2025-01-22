import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Clock, Phone } from 'lucide-react';

const EmergencyProcedures = () => {
  const [activeIncident, setActiveIncident] = useState(null);

  const procedures = [
    {
      id: 'perf-degradation',
      title: 'Dégradation Performances',
      priority: 'high',
      triggers: [
        'Temps réponse > 200ms',
        'CPU > 80%',
        'Mémoire > 85%'
      ],
      steps: [
        'Vérifier métriques temps réel',
        'Isoler composant problématique',
        'Activer mode dégradé si nécessaire',
        'Notifier équipe technique'
      ],
      contacts: ['support@sapav.com', 'Tel: 0123456789']
    },
    {
      id: 'cache-failure',
      title: 'Panne Cache',
      priority: 'critical',
      triggers: [
        'Hit rate < 90%',
        'Temps sync > 500ms',
        'Erreurs invalidation'
      ],
      steps: [
        'Basculer mode dégradé',
        'Reconstruire cache progressif',
        'Vérifier intégrité données',
        'Analyser cause racine'
      ],
      contacts: ['cache-support@sapav.com', 'Tel: 0123456788']
    },
    {
      id: 'ai-service',
      title: 'Service IA Indisponible',
      priority: 'high',
      triggers: [
        'Timeout réponses IA',
        'Erreurs génération > 2%',
        'Latence anormale'
      ],
      steps: [
        'Vérifier quotas API',
        'Basculer service fallback',
        'Réduire charge requêtes',
        'Contacter support IA'
      ],
      contacts: ['ai-support@sapav.com', 'Tel: 0123456787']
    },
    {
      id: 'drive-sync',
      title: 'Problème Sync Drive',
      priority: 'medium',
      triggers: [
        'Erreurs synchronisation',
        'Conflits documents',
        'Pertes connexion'
      ],
      steps: [
        'Vérifier connectivité API',
        'Sauvegarder local',
        'Résoudre conflits',
        'Resynchroniser'
      ],
      contacts: ['drive-support@sapav.com', 'Tel: 0123456786']
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Procédures d'Urgence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procedures.map((procedure) => (
              <Card key={procedure.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {procedure.title}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(procedure.priority)}`}>
                      {procedure.priority}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        Déclencheurs
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {procedure.triggers.map((trigger, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                            {trigger}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        Actions Immédiates
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {procedure.steps.map((step, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        Contacts
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {procedure.contacts.map((contact, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            {contact}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeIncident === procedure.id && (
                      <Alert>
                        <CheckCircle2 className="w-4 h-4" />
                        <AlertTitle>Procédure Activée</AlertTitle>
                        <AlertDescription>
                          Équipe technique notifiée. Suivez les étapes ci-dessus.
                        </AlertDescription>
                      </Alert>
                    )}

                    <button
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                        activeIncident === procedure.id
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      onClick={() => setActiveIncident(
                        activeIncident === procedure.id ? null : procedure.id
                      )}
                    >
                      {activeIncident === procedure.id
                        ? 'Désactiver Procédure'
                        : 'Activer Procédure'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyProcedures;