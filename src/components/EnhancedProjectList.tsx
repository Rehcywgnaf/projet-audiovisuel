import React, { useState, useMemo } from 'react';
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
  Calendar 
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
const ProjectStatusMiniStats = ({ projects }: { projects: Project[] }) => {
  const statusCounts = useMemo(() => {
    // Vérification de l'existence et du type de projects
    if (!Array.isArray(projects)) return {};

    return projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [projects]);

  return (
    <div className="flex space-x-4">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div key={status} className="flex items-center space-x-2">
          <Badge variant="outline">{status}</Badge>
          <span className="text-sm text-muted-foreground">{count}</span>
        </div>
      ))}
    </div>
  );
};

// Composant de graphique de progression
const ProjectProgressChart = ({ projects }: { projects: Project[] }) => {
  const chartData = useMemo(() => {
    // Vérification de l'existence et du type de projects
    if (!Array.isArray(projects)) return [];

    const statusProgress = {
      'active': 0,
      'pending': 0,
      'completed': 0
    };

    projects.forEach(project => {
      statusProgress[project.status] += project.progress || 0;
    });

    return Object.entries(statusProgress).map(([status, totalProgress]) => ({
      status,
      progress: totalProgress / (projects.filter(p => p.status === status).length || 1)
    }));
  }, [projects]);

  // Si pas de données, ne pas afficher le graphique
  if (chartData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <XAxis dataKey="status" />
        <Tooltip />
        <Bar dataKey="progress" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Composant principal de liste de projets
export default function EnhancedProjectList({ 
  projects = [], // Défaut à un tableau vide
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
    // Vérification de l'existence et du type de projects
    if (!Array.isArray(projects)) return [];

    let result = [...projects];

    // Filtrage par statut
    if (filterStatus) {
      result = result.filter(p => p.status === filterStatus);
    }

    // Tri
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

  // Gestion des cas où il n'y a pas de projets
  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucun projet disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Projets</CardTitle>
          <div className="flex space-x-2">
            {/* Filtres de statut */}
            <Select onValueChange={(val) => setFilterStatus(val || null)}>
              <SelectTrigger className="w-[180px]">
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
            <Select onValueChange={(val) => setSortKey(val as keyof Project)}>
              <SelectTrigger className="w-[180px]">
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
        <div className="mb-4">
          <ProjectStatusMiniStats projects={projects} />
        </div>

        {/* Graphique de progression */}
        <div className="mb-4">
          <ProjectProgressChart projects={projects} />
        </div>

        {/* Liste de projets */}
        <div className="space-y-4">
          {paginatedProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.organization}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Indicateur de progression */}
                    {project.progress !== undefined && (
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <Progress value={project.progress} className="w-[100px]" />
                      </div>
                    )}
                    
                    {/* Badge de statut */}
                    <Badge variant={
                      project.status === 'active' ? 'default' :
                      project.status === 'pending' ? 'outline' : 'secondary'
                    }>
                      {project.status}
                    </Badge>
                    
                    {/* Date de mise à jour */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} sur {Math.ceil(processedProjects.length / pageSize)}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(prev => 
              prev < Math.ceil(processedProjects.length / pageSize) ? prev + 1 : prev
            )}
            disabled={currentPage >= Math.ceil(processedProjects.length / pageSize)}
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};