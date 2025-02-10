import { useState, useEffect } from 'react';
import { projectService } from '@/services/ProjectService';

export interface Project {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'pending';
  lastUpdate: Date;
  lastUpdateRelative: string;
  type: 'AAP' | 'AO';
  team?: string;
  progress: number;
}

interface ProjectsData {
  active: Project[];
  completed: Project[];
  recent: Project[];
  newThisMonth: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.getProjects();
        const stats = await projectService.getProjectStats();
        
        // Traitement des données
        const processedData: ProjectsData = {
          active: data.filter(p => p.status === 'active'),
          completed: data.filter(p => p.status === 'completed'),
          recent: data.sort((a, b) => 
            new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
          ).slice(0, 5),
          newThisMonth: stats.newThisMonth || 0
        };

        setProjects(processedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des projets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
};