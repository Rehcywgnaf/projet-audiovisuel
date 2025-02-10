import { useState, useEffect } from 'react';
import { teamService } from '@/services/TeamService';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: number;
}

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
        const data = await teamService.getTeams();
        const stats = await teamService.getTeamStats();
        
        // Traitement des données
        const processedData: TeamsData = {
          active: data.filter(t => t.status === 'active'),
          inactive: data.filter(t => t.status === 'inactive'),
          activeMembers: stats.activeMembers || 0,
          totalMembers: stats.totalMembers || 0
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