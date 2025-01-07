import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Film, Calendar } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  availability: string;
  currentProjects: string[];
  nextAvailable: string;
}

interface Team {
  name: string;
  members: TeamMember[];
}

export default function TeamTracking() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetchTeamData();
  }, []);

  async function fetchTeamData() {
    // Implémentation fetch data
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suivi des Équipes</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Users className="w-4 h-4 mr-2" />
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
        {/* Implémentation contenu */}
      </CardContent>
    </Card>
  );
}