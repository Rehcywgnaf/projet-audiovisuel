import { useState, useEffect } from 'react';
import { projectService } from '@/services/ProjectService';

export interface Project {
  id: string;
  title: string;
  organization: string;
  status: 'active' | 'completed' | 'pending';
  updatedAt: string;
  progress: number;
  budget: number;
  deadline: string;
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
        const projectsData = await projectService.getProjects();
        const stats = await projectService.getProjectStats();
        
        // Traitement des données pour correspondre à l'interface ProjectsData
        const processedData: ProjectsData = {
          active: projectsData.filter(p => p.status === 'active'),
          completed: projectsData.filter(p => p.status === 'completed'),
          recent: projectsData
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5),
          newThisMonth: stats.activeProjects || 0
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