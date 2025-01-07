import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Film, Calendar } from 'lucide-react';
import { TeamService, TeamMember } from '../../services/TeamService';

interface Team {
  name: string;
  members: TeamMember[];
}

export default function TeamTracking() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const teamService = new TeamService();
        const members = await teamService.getTeamAvailability();
        const groupedTeams = groupMembersByTeam(members);
        setTeams(groupedTeams);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données équipe');
        console.error('Erreur TeamTracking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  function groupMembersByTeam(members: TeamMember[]): Team[] {
    const grouped = members.reduce((acc, member) => {
      const team = member.role.split('/')[0];
      if (!acc[team]) acc[team] = [];
      acc[team].push(member);
      return acc;
    }, {} as Record<string, TeamMember[]>);

    return Object.entries(grouped).map(([name, members]) => ({ name, members }));
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 text-center">{error}</div>
  );

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
          <TeamCard key={index} team={team} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  return (
    <Card>
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
                <span className={getAvailabilityClass(member.availability)}>
                  {member.availability}% dispo
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Film className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Projets actifs:</span>
                  <div className="flex gap-1 flex-wrap">
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
                  <span className={member.nextAvailable < new Date() ? 'text-green-600' : ''}>
                    {formatDate(member.nextAvailable)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getAvailabilityClass(availability: number): string {
  const baseClass = 'px-2 py-1 rounded-full text-sm';
  if (availability > 80) return `${baseClass} bg-green-100 text-green-800`;
  if (availability > 40) return `${baseClass} bg-yellow-100 text-yellow-800`;
  return `${baseClass} bg-red-100 text-red-800`;
}

function formatDate(date: Date): string {
  if (date < new Date()) return 'Disponible';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date);
}