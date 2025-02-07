import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, FolderOpen, Activity, CheckCircle2 } from 'lucide-react';
import EnhancedProjectList from './EnhancedProjectList';
import { projectService } from '@/services/ProjectService';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { StatsCard } from './ui/stats-card';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [projectsData, statsData] = await Promise.all([
        projectService.getProjects(),
        projectService.getProjectStats()
      ]);

      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
      setError('Une erreur est survenue lors du chargement des données.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchProjectData} variant="outline" size="sm">
          <Loader2 className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Projets"
          value={stats.totalProjects}
          icon={<FolderOpen />}
          loading={isLoading}
        />
        <StatsCard
          title="Projets Actifs"
          value={stats.activeProjects}
          icon={<Activity />}
          trend={12}
          className="bg-green-50"
          loading={isLoading}
        />
        <StatsCard
          title="Projets Terminés"
          value={stats.completedProjects}
          icon={<CheckCircle2 />}
          trend={-5}
          className="bg-blue-50"
          loading={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-500 mb-4">Aucun projet disponible</p>
          <Button 
            onClick={fetchProjectData} 
            variant="outline"
            size="sm"
          >
            <Loader2 className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      ) : (
        <EnhancedProjectList projects={projects} />
      )}
    </div>
  );
}