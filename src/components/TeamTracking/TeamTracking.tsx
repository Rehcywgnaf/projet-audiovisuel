import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Film, Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function TeamTracking() {
  // Données par défaut pour le développement
  const defaultTeams = [
    {
      name: 'Équipe Technique',
      members: [
        {
          name: 'Jean Dupont',
          role: 'Directeur Technique',
          availability: '80',
          currentProjects: ['Documentaire Nature'],
          nextAvailable: '15 Feb 2024',
          alerts: ['Deadline proche sur Documentaire Nature']
        },
        {
          name: 'Marie Martin',
          role: 'Cadreur',
          availability: '100',
          currentProjects: ['Web-série Innovation'],
          nextAvailable: 'Disponible',
          alerts: []
        }
      ]
    },
    {
      name: 'Production',
      members: [
        {
          name: 'Pierre Dubois',
          role: 'Producteur',
          availability: '50',
          currentProjects: ['Documentaire Nature', 'Web-série Innovation'],
          nextAvailable: '1 Mar 2024',
          alerts: ['Surcharge potentielle: 2 projets en parallèle']
        },
        {
          name: 'Sophie Lambert',
          role: 'Assistante de Production',
          availability: '75',
          currentProjects: ['Web-série Innovation'],
          nextAvailable: '20 Feb 2024',
          alerts: []
        }
      ]
    }
  ];

  const [teams, setTeams] = useState(defaultTeams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        // TODO: Intégration future avec Google Drive
        // const response = await window.fs.readFile('team_data.json');
        // const data = JSON.parse(new TextDecoder().decode(response));
        // setTeams(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    // Commenté pour le développement
    // fetchTeamData();
  }, []);

  const getAvailabilityColor = (availability) => {
    const value = parseInt(availability);
    if (value > 80) return 'bg-green-100 text-green-800';
    if (value > 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) return <div className="p-6">Chargement des données...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suivi des Équipes</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Gérer les équipes
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Film className="w-4 h-4" />
            Assigner projet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {team.name}
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {team.members.length} membres
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {team.members.map((member, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${getAvailabilityColor(member.availability)}`}>
                        {member.availability} dispo
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Film className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Projets actifs:</span>
                        <div className="flex flex-wrap gap-1">
                          {member.currentProjects.map((project, p) => (
                            <span key={p} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Prochaine disponibilité:</span>
                        <span className={member.nextAvailable === 'Disponible' ? 'text-green-600 font-medium' : ''}>
                          {member.nextAvailable}
                        </span>
                      </div>

                      {member.alerts && member.alerts.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-yellow-700">
                            {member.alerts.map((alert, a) => (
                              <div key={a}>{alert}</div>
                            ))}
                          </div>
                        </div>
                      )}
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
