import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Calendar, Bell, Clock } from 'lucide-react';

const GestionDeadlines = () => {
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      projet: 'Documentaire Nature',
      date: '2024-02-15',
      statut: 'en_cours',
      priorite: 'haute'
    }
  ]);

  const PrioriteTag = ({ priorite }) => {
    const couleurs = {
      haute: 'bg-red-100 text-red-800',
      moyenne: 'bg-yellow-100 text-yellow-800',
      basse: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${couleurs[priorite]}`}>
        {priorite.charAt(0).toUpperCase() + priorite.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Deadlines à venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deadlines.map((deadline) => (
              <div key={deadline.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{deadline.projet}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(deadline.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <PrioriteTag priorite={deadline.priorite} />
                </div>
                {deadline.statut === 'en_cours' && (
                  <Alert className="mt-2 bg-blue-50 text-blue-800">
                    <Bell className="w-4 h-4" />
                    <span className="ml-2">Deadline approchante</span>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionDeadlines;
