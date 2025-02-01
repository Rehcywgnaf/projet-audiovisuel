import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Navigation } from './Navigation';
import { KPIs } from './KPIs';
import { TeamManager } from '@/components/team/core/TeamManager';
import { useTeamTracking } from '@/components/team/ui/tracking/hooks';

interface DashboardProps {
  teamManager: TeamManager;
}

export default function Dashboard({ teamManager }: DashboardProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>();
  const { teams, loading, error } = useTeamTracking(teamManager);

  const filteredTeams = selectedTeamId 
    ? teams.filter(team => team.id === selectedTeamId)
    : teams;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 p-4">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Navigation 
        teams={teams}
        selectedTeamId={selectedTeamId}
        onTeamSelect={setSelectedTeamId}
      />
      
      <KPIs teams={filteredTeams} />
    </div>
  );
}