import React from 'react';
import { 
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useProjects } from '@/hooks/useProjects';

const ProjectsView = () => {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center">
      <Activity className="h-8 w-8 animate-spin text-blue-600" />
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      {error}
    </div>;
  }

  if (!projects) return null;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Projets Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.active.length}
            </div>
            <div className="text-xs text-gray-500">
              +{projects.newThisMonth} ce mois
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Projets Complétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.completed.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Dernière Mise à Jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(projects.recent[0]?.updatedAt || '').toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projets Actifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Projets en Cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.active.map((project) => (
              <div key={project.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.organization}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {project.progress}%
                    </span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Budget: {project.budget.toLocaleString()}€
                  </span>
                  <span className="text-gray-500">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projets Récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.recent.map((project) => (
              <div key={project.id} 
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {project.status === 'active' ? (
                    <Clock className="h-4 w-4 text-blue-600" />
                  ) : project.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {project.organization}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsView;