import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Film, Calendar } from 'lucide-react';

export default function TeamTracking() {
  const teams = [
    {
      name: 'Équipe Technique',
      members: [
        {
          name: 'Jean Dupont',
          role: 'Directeur Technique',
          availability: '80%',
          currentProjects: ['Documentaire Nature'],
          nextAvailable: '15 Feb 2024'
        },
        {
          name: 'Marie Martin',
          role: 'Cadreur',
          availability: '100%',
          currentProjects: ['Web-série Innovation'],
          nextAvailable: 'Disponible'
        }
      ]
    },
    {
      name: 'Production',
      members: [
        {
          name: 'Pierre Dubois',
          role: 'Producteur',
          availability: '50%',
          currentProjects: ['Documentaire Nature', 'Web-série Innovation'],
          nextAvailable: '1 Mar 2024'
        }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suivi des Équipes</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Ajouter membre
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-sm ${
                          parseInt(member.availability) > 80 
                            ? 'bg-green-100 text-green-800'
                            : parseInt(member.availability) > 40
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {member.availability} dispo
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Film className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Projets actifs:</span>
                        <div className="flex gap-1">
                          {member.currentProjects.map((project, p) => (
                            <span key={p} className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Prochaine disponibilité:</span>
                        <span className={member.nextAvailable === 'Disponible' ? 'text-green-600' : ''}>
                          {member.nextAvailable}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
