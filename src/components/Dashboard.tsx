import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import EnhancedProjectList, { Project } from './EnhancedProjectList';
import { projectService } from '@/services/ProjectService';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        
        // Récupération parallèle des projets et statistiques
        const [projectsData, statsData] = await Promise.all([
          projectService.getProjects(),
          projectService.getProjectStats()
        ]);

        setProjects(projectsData);
        setStats(statsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projets Terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.completedProjects}</p>
          </CardContent>
        </Card>
      </div>

      <EnhancedProjectList projects={projects} />
    </div>
  );
}