import { useState, useEffect } from 'react';
import { TeamManager } from '../../core/TeamManager';
import { TeamState, Team, TeamMember } from '../../core/types';

export const useTeamTracking = (teamManager: TeamManager) => {
  const [state, setState] = useState<TeamState>({
    teams: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = teamManager.subscribe(setState);
    teamManager.fetchTeams();
    return unsubscribe;
  }, [teamManager]);

  return {
    teams: state.teams,
    loading: state.loading,
    error: state.error,
    updateMemberAvailability: teamManager.updateMemberAvailability.bind(teamManager),
    getTeamById: teamManager.getTeamById.bind(teamManager)
  };
};

export const useTeamMetrics = (team: Team) => {
  const getTeamAvailability = () => {
    if (!team.members.length) return 0;
    const totalAvailability = team.members.reduce(
      (sum, member) => sum + member.availability, 
      0
    );
    return Math.round(totalAvailability / team.members.length);
  };

  const getNextAvailableMember = () => {
    return team.members
      .filter(member => member.availability > 80)
      .sort((a, b) => a.currentProjects.length - b.currentProjects.length)[0];
  };

  return {
    teamAvailability: getTeamAvailability(),
    nextAvailableMember: getNextAvailableMember(),
    memberCount: team.members.length,
    activeProjectsCount: team.projects.length
  };
};