import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Phone, Clock, ArrowUpCircle, Users, Bell } from 'lucide-react';

const IncidentEscalation = () => {
  const [activeEscalations, setActiveEscalations] = useState([]);

  const escalationLevels = [
    {
      id: 'level-1',
      name: 'Support Niveau 1',
      timeframe: '15 min',
      team: 'Équipe Support',
      actions: [
        'Notification email équipe',
        'SMS responsable support',
        'Création ticket urgent'
      ],
      contacts: [
        { name: 'Support 24/7', phone: '0123456789' },
        { name: 'Responsable N1', phone: '0123456788' }
      ]
    },
    {
      id: 'level-2',
      name: 'Support Technique',
      timeframe: '30 min',
      team: 'Équipe Technique',
      actions: [
        'Escalade équipe technique',
        'Notification responsable projet',
        'Rapport préliminaire'
      ],
      contacts: [
        { name: 'Lead Tech', phone: '0123456787' },
        { name: 'Chef Projet', phone: '0123456786' }
      ]
    },
    {
      id: 'level-3',
      name: 'Direction Technique',
      timeframe: '1h',
      team: 'Direction & Managers',
      actions: [
        'Réunion de crise',
        'Communication clients',
        'Plan d\'action urgent'
      ],
      contacts: [
        { name: 'Directeur Technique', phone: '0123456785' },
        { name: 'Manager Service', phone: '0123456784' }
      ]
    }
  ];

  const handleEscalation = (levelId) => {
    if (activeEscalations.includes(levelId)) {
      setActiveEscalations(activeEscalations.filter(id => id !== levelId));
    } else {
      setActiveEscalations([...activeEscalations, levelId]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5" />
            Escalade des Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {escalationLevels.map((level, index) => (
              <Card 
                key={level.id} 
                className={`border-l-4 ${
                  activeEscalations.includes(level.id)
                    ? 'border-l-red-500'
                    : 'border-l-blue-500'
                }`}
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {level.name}
                          {activeEscalations.includes(level.id) && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Délai: {level.timeframe}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Niveau {index + 1}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        {level.team}
                      </h4>
                      <ul className="space-y-1">
                        {level.actions.map((action, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" />
                        Contacts
                      </h4>
                      <ul className="space-y-1">
                        {level.contacts.map((contact, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            {contact.name} - {contact.phone}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeEscalations.includes(level.id) && (
                      <Alert>
                        <Bell className="w-4 h-4" />
                        <AlertTitle>Escalade Active</AlertTitle>
                        <AlertDescription>
                          Notifications envoyées. Équipe {level.team} mobilisée.
                        </AlertDescription>
                      </Alert>
                    )}

                    <button
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                        activeEscalations.includes(level.id)
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      onClick={() => handleEscalation(level.id)}
                    >
                      {activeEscalations.includes(level.id)
                        ? 'Désactiver Escalade'
                        : 'Activer Escalade'}
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

export default IncidentEscalation;