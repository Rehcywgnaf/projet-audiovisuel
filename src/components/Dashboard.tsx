import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, FolderOpen, Activity, CheckCircle2, Rss, Users } from 'lucide-react';
import EnhancedProjectList from './EnhancedProjectList';
import { projectService } from '@/services/ProjectService';
import { rssProjectService } from '@/services/RSSProjectService';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { StatsCard } from './ui/stats-card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [rssSources, setRssSources] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    rssSourcesCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Utilisation de RSSProjectService
      const sources = rssProjectService.getSources();
      const rssProjects = rssProjectService.convertToProjects();
      const rssStats = rssProjectService.getProjectStats();

      const [projectsData, projectStats] = await Promise.all([
        projectService.getProjects(),
        projectService.getProjectStats()
      ]);

      setProjects(rssProjects.concat(projectsData));
      setRssSources(sources);
      
      setStats({
        ...projectStats,
        rssSourcesCount: sources.length,
        totalProjects: projectStats.totalProjects + rssProjects.length,
        activeProjects: projectStats.activeProjects + rssStats.activeProjects,
        completedProjects: projectStats.completedProjects + rssStats.completedProjects
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
      setError('Une erreur est survenue lors du chargement des données.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <Loader2 className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Principales */}
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

      {/* Sections Secondaires */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sources RSS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rss className="w-5 h-5" /> 
              Sources RSS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : rssSources.length > 0 ? (
              <ul className="space-y-2">
                {rssSources.slice(0, 5).map(source => (
                  <li key={source.id} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-sm">{source.url}</h3>
                        <p className="text-xs text-gray-500">{source.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          source.status === 'active' ? 'bg-green-50 text-green-600' :
                          source.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {source.status}
                        </span>
                        {source.analysis && (
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                            Score: {source.analysis.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Aucune source RSS</p>
            )}
          </CardContent>
        </Card>

        {/* Liste des Projets */}
        <Card>
          <CardHeader>
            <CardTitle>Derniers Projets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : projects.length > 0 ? (
              <ul className="space-y-2">
                {projects.slice(0, 5).map(project => (
                  <li key={project.id} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-sm">{project.title}</h3>
                        <p className="text-xs text-gray-500">{project.organization}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.status === 'active' ? 'bg-green-50 text-green-600' :
                          project.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Aucun projet disponible</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Liste complète des projets */}
      {!isLoading && projects.length > 0 && (
        <EnhancedProjectList projects={projects} />
      )}
    </div>
  );
}