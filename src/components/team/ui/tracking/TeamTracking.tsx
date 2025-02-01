import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Film, Calendar, AlertTriangle } from 'lucide-react';
import { useTeamTracking, useTeamMetrics } from './hooks';
import { TeamManager } from '../../core/TeamManager';

interface TeamTrackingProps {
  teamManager: TeamManager;
}

export const TeamTracking = ({ teamManager }: TeamTrackingProps) => {
  const { teams, loading, error, updateMemberAvailability } = useTeamTracking(teamManager);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {teams.map(team => {
        const metrics = useTeamMetrics(team);
        
        return (
          <Card key={team.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{team.name}</span>
                </div>
                <span 
                  className={`px-2 py-1 text-sm rounded-full ${
                    metrics.teamAvailability > 80
                      ? 'bg-green-100 text-green-800'
                      : metrics.teamAvailability > 40
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {metrics.teamAvailability}% disponible
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {team.members.map(member => (
                  <div 
                    key={member.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={member.availability}
                        onChange={(e) => updateMemberAvailability(
                          member.id, 
                          parseInt(e.target.value)
                        )}
                        className="w-32"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Film className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Projets actifs:</span>
                        <div className="flex gap-1">
                          {member.currentProjects.map((project, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded"
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Prochaine disponibilité:
                        </span>
                        <span 
                          className={
                            member.nextAvailable === 'Disponible' 
                              ? 'text-green-600' 
                              : ''
                          }
                        >
                          {member.nextAvailable}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};