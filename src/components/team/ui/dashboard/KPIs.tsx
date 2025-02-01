import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Clock, AlertTriangle } from 'lucide-react';
import { Team } from '../../core/types';

interface KPIsProps {
  teams: Team[];
}

export function KPIs({ teams }: KPIsProps) {
  const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
  const totalProjects = teams.reduce((sum, team) => sum + team.projects.length, 0);
  
  const totalAvailability = teams.reduce((sum, team) => {
    const teamAvg = team.members.reduce(
      (teamSum, member) => teamSum + member.availability, 
      0
    ) / (team.members.length || 1);
    return sum + teamAvg;
  }, 0) / (teams.length || 1);

  const lowAvailabilityCount = teams.reduce((sum, team) => {
    return sum + team.members.filter(m => m.availability < 40).length;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Équipes</p>
              <p className="text-2xl font-bold">{totalMembers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Projets</p>
              <p className="text-2xl font-bold">{totalProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Disponibilité</p>
              <p className="text-2xl font-bold">{Math.round(totalAvailability)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={lowAvailabilityCount > 0 ? "bg-red-50" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-8 h-8 ${
              lowAvailabilityCount > 0 ? "text-red-500" : "text-gray-400"
            }`} />
            <div>
              <p className="text-sm font-medium text-gray-500">Alertes</p>
              <p className="text-2xl font-bold">{lowAvailabilityCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}