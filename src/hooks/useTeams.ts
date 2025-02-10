import { useState, useEffect } from 'react';
import TeamService, { TeamMember } from '@/services/TeamService';

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  activeProjects: number;
  occupancy: number;
  status: 'active' | 'inactive';
}

interface TeamsData {
  active: Team[];
  inactive: Team[];
  activeMembers: number;
  totalMembers: number;
}

export const useTeams = () => {
  const [teams, setTeams] = useState<TeamsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const teamService = TeamService.getInstance(); // Utilisation du singleton
        const members = await teamService.getTeamMembers();

        // Organiser les membres en équipes
        const teamsByProject = members.reduce((acc, member) => {
          member.currentProjects.forEach(projectName => {
            if (!acc[projectName]) {
              acc[projectName] = {
                id: projectName,
                name: projectName,
                members: [],
                activeProjects: 1,
                occupancy: 0,
                status: 'active' as const
              };
            }
            acc[projectName].members.push(member);
            acc[projectName].occupancy = acc[projectName].members.reduce(
              (sum, m) => sum + (100 - m.availability),
              0
            ) / acc[projectName].members.length;
          });
          return acc;
        }, {} as Record<string, Team>);

        // Transforme l'objet en tableau et calcule les statistiques
        const allTeams = Object.values(teamsByProject);
        const processedData: TeamsData = {
          active: allTeams.filter(t => t.occupancy > 0),
          inactive: allTeams.filter(t => t.occupancy === 0),
          activeMembers: members.filter(m => m.currentProjects.length > 0).length,
          totalMembers: members.length
        };

        setTeams(processedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des équipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, isLoading, error };
};