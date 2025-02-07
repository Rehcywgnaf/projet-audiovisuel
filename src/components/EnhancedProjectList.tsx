import React, { useState, useMemo, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "./ui/card";
import { Button } from "./ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Types enrichis
export type Project = {
  id: string;
  title: string;
  organization: string;
  status: 'active' | 'pending' | 'completed';
  updatedAt: string;
  budget?: number;
  deadline?: string;
  progress?: number;
  priority?: 'low' | 'medium' | 'high';
};

// Composant de statistiques inline
const ProjectStatusMiniStats = React.memo(({ projects }: { projects: Project[] }) => {
  const statusCounts = useMemo(() => {
    if (!Array.isArray(projects)) return {};

    return projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [projects]);

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="flex flex-wrap gap-4">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div key={status} className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={statusColors[status as keyof typeof statusColors]}
          >
            {status}
          </Badge>
          <span className="text-sm text-muted-foreground">{count}</span>
        </div>
      ))}
    </div>
  );
});

// Composant de graphique de progression
const ProjectProgressChart = React.memo(({ projects }: { projects: Project[] }) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(projects)) return [];

    const statusProgress = {
      'active': 0,
      'pending': 0,
      'completed': 0
    };

    const statusCount = {
      'active': 0,
      'pending': 0,
      'completed': 0
    };

    projects.forEach(project => {
      if (project.progress !== undefined) {
        statusProgress[project.status] += project.progress;
        statusCount[project.status]++;
      }
    });

    return Object.entries(statusProgress).map(([status, totalProgress]) => ({
      status,
      progress: statusCount[status as keyof typeof statusCount] 
        ? totalProgress / statusCount[status as keyof typeof statusCount] 
        : 0
    }));
  }, [projects]);

  if (chartData.length === 0) return null;

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="status" />
          <Tooltip />
          <Bar 
            dataKey="progress" 
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

// Composant de projet individuel
const ProjectCard = React.memo(({ project }: { project: Project }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className="pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.organization}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {project.progress !== undefined && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <Progress value={project.progress} className="w-[100px]" />
            </div>
          )}
          
          <Badge 
            variant={
              project.status === 'active' ? 'default' :
              project.status === 'pending' ? 'outline' : 'secondary'
            }
            className={project.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          >
            {project.status}
          </Badge>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
));

// Composant principal de liste de projets
export default function EnhancedProjectList({ 
  projects = [], 
  pageSize = 5 
}: { 
  projects?: Project[], 
  pageSize?: number 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Project>('updatedAt');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Logique de tri et filtrage
  const processedProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];

    let result = [...projects];

    if (filterStatus) {
      result = result.filter(p => p.status === filterStatus);
    }

    result.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return -1;
      if (a[sortKey] > b[sortKey]) return 1;
      return 0;
    });

    return result;
  }, [projects, sortKey, filterStatus]);

  // Pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedProjects.slice(startIndex, startIndex + pageSize);
  }, [processedProjects, currentPage, pageSize]);

  const totalPages = Math.ceil(processedProjects.length / pageSize);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  // Si pas de projets
  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucun projet disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Projets</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Filtres */}
            <Select 
              onValueChange={(val) => {
                setFilterStatus(val || null);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
              </SelectContent>
            </Select>

            {/* Tri */}
            <Select 
              onValueChange={(val) => {
                setSortKey(val as keyof Project);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Titre</SelectItem>
                <SelectItem value="updatedAt">Date de mise à jour</SelectItem>
                <SelectItem value="organization">Organisation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Mini statistiques */}
        <div className="mb-6">
          <ProjectStatusMiniStats projects={projects} />
        </div>

        {/* Graphique de progression */}
        <div className="mb-6">
          <ProjectProgressChart projects={projects} />
        </div>

        {/* Liste de projets */}
        <div className="space-y-4">
          {paginatedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </span>

          <Button 
            variant="outline"
            size="sm" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}