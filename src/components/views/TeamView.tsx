import React from 'react';
import { 
  Activity,
  Users,
  Calendar,
  ChevronRight,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useTeams } from '@/hooks/useTeams';

const TeamView = () => {
  const { teams, isLoading, error } = useTeams();

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center">
      <Activity className="h-8 w-8 animate-spin text-blue-600" />
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      {error}
    </div>;
  }

  if (!teams) return null;

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Équipes Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.active.length}
            </div>
            <div className="text-xs text-gray-500">
              {teams.activeMembers} membres actifs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Taux d'Occupation Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teams.active.reduce((acc, team) => 
                acc + team.occupancy, 0) / teams.active.length)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Membres Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.totalMembers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Équipes Actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Équipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teams.active.map((team) => (
              <div key={team.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{team.name}</h3>
                    <p className="text-sm text-gray-500">
                      {team.members.length} membres - {team.activeProjects} projets
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      team.occupancy > 80 
                        ? 'bg-red-100 text-red-800'
                        : team.occupancy > 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {team.occupancy}% occupé
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-gray-500">{member.role}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {100 - member.availability}% occupé
                        </span>
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {member.nextAvailable}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Occupation par Projet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Occupation par Projet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teams.active.flatMap(team => 
              team.members.flatMap(member => 
                member.currentProjects.map(project => ({
                  project,
                  member: member.name,
                  occupation: 100 - member.availability
                }))
              )
            ).reduce((acc, curr) => {
              const existingProject = acc.find(p => p.name === curr.project);
              if (existingProject) {
                existingProject.members += 1;
                existingProject.avgOccupation = 
                  (existingProject.avgOccupation * (existingProject.members - 1) + curr.occupation) 
                  / existingProject.members;
              } else {
                acc.push({
                  name: curr.project,
                  members: 1,
                  avgOccupation: curr.occupation
                });
              }
              return acc;
            }, [] as Array<{name: string, members: number, avgOccupation: number}>)
            .sort((a, b) => b.avgOccupation - a.avgOccupation)
            .map(project => (
              <div 
                key={project.name}
                className="p-2 flex items-center justify-between hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {project.avgOccupation > 80 ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : project.avgOccupation > 50 ? (
                    <Activity className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  <span className="font-medium">{project.name}</span>
                  <span className="text-sm text-gray-500">
                    ({project.members} membres)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        project.avgOccupation > 80 
                          ? 'bg-red-500'
                          : project.avgOccupation > 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${project.avgOccupation}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {Math.round(project.avgOccupation)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamView;