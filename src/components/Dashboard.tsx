import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import EnhancedProjectList, { Project } from './EnhancedProjectList';
import { projectService } from '@/services/ProjectService';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const StatCard = ({ title, value, color = 'text-gray-900' }: { title: string, value: number, color?: string }) => (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color} ${isLoading ? 'animate-pulse' : ''}`}>
          {isLoading ? '-' : value}
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={fetchProjectData}
          className="w-full sm:w-auto"
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Projets" 
          value={stats.totalProjects} 
        />
        <StatCard 
          title="Projets Actifs" 
          value={stats.activeProjects} 
          color="text-green-600"
        />
        <StatCard 
          title="Projets Terminés" 
          value={stats.completedProjects} 
          color="text-blue-600"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-500 mb-4">Aucun projet disponible</p>
            <Button onClick={fetchProjectData} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Rafraîchir
            </Button>
          </CardContent>
        </Card>
      ) : (
        <EnhancedProjectList projects={projects} />
      )}
    </div>
  );
}