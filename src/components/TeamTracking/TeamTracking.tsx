import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Film, Calendar, AlertTriangle, Clock } from 'lucide-react';

export default function TeamTracking() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Données initiales pour le développement
  const initialTeams = [
    {
      name: 'Équipe Technique',
      members: [
        {
          name: 'Jean Dupont',
          role: 'Directeur Technique',
          currentProjects: [
            { name: 'Documentaire Nature', timeAllocation: 40 },
            { name: 'Web-série Innovation', timeAllocation: 30 }
          ],
          nextAvailable: '2024-02-15'
        },
        {
          name: 'Marie Martin',
          role: 'Cadreur',
          currentProjects: [
            { name: 'Web-série Innovation', timeAllocation: 60 }
          ],
          nextAvailable: '2024-01-04'
        }
      ]
    },
    {
      name: 'Production',
      members: [
        {
          name: 'Pierre Dubois',
          role: 'Producteur',
          currentProjects: [
            { name: 'Documentaire Nature', timeAllocation: 25 },
            { name: 'Web-série Innovation', timeAllocation: 25 },
            { name: 'Formation Corporate', timeAllocation: 30 }
          ],
          nextAvailable: '2024-03-01'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulation d'un chargement asynchrone
    const loadData = async () => {
      try {
        // TODO: Remplacer par un vrai appel API quand le backend sera prêt
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai réseau
        setTeams(initialTeams);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données équipes');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const calculateWorkload = (projects) => {
    return projects.reduce((acc, curr) => acc + curr.timeAllocation, 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suivi des Équipes</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Ajouter membre
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Film className="w-4 h-4" />
            Nouveau projet
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Chargement des données...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {team.name}
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {team.members.length} membres
                  </span>
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
                            calculateWorkload(member.currentProjects) > 80 
                              ? 'bg-red-100 text-red-800'
                              : calculateWorkload(member.currentProjects) > 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {calculateWorkload(member.currentProjects)}% charge
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Film className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Projets actifs:</span>
                          <div className="flex flex-wrap gap-1">
                            {member.currentProjects.map((project, p) => (
                              <span key={p} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {project.name} ({project.timeAllocation}%)
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Prochaine disponibilité:</span>
                          <span className={
                            new Date(member.nextAvailable) <= new Date() 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }>
                            {new Date(member.nextAvailable).toLocaleDateString()}
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
      )}
    </div>
  );
}