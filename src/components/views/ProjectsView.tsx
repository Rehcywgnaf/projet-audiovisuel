import React from 'react';
import { 
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BanknoteIcon,
  CalendarIcon
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useProjects } from '@/hooks/useProjects';
import { cn } from "@/lib/utils";

const StatCard = ({ 
  title, 
  value, 
  description 
}: { 
  title: string;
  value: string | number;
  description?: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {value}
      </div>
      {description && (
        <div className="text-xs text-muted-foreground">
          {description}
        </div>
      )}
    </CardContent>
  </Card>
);

const ProjectCard = ({ project }: { project: any }) => (
  <Card className="hover:shadow transition-shadow">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.organization}</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Progress 
                value={project.progress} 
                className="w-24"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{project.progress}% complété</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <BanknoteIcon className="h-4 w-4" />
          <span>{project.budget.toLocaleString()}€</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(project.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProjectsView = () => {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
        {error}
      </div>
    );
  }

  if (!projects) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Projets Actifs"
          value={projects.active.length}
          description={`+${projects.newThisMonth} ce mois`}
        />
        <StatCard 
          title="Projets Complétés"
          value={projects.completed.length}
        />
        <StatCard 
          title="Dernière Mise à Jour"
          value={new Date(projects.recent[0]?.updatedAt || '').toLocaleDateString()}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Projets en Cours</CardTitle>
            </div>
            <Badge variant="outline">
              {projects.active.length} projets
            </Badge>
          </div>
          <CardDescription>
            Vue d'ensemble des projets actuellement en développement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {projects.active.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              <CardTitle>Activité Récente</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.recent.map((project) => (
              <div 
                key={project.id} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  "hover:bg-muted/50 transition-colors"
                )}
              >
                <div className="flex items-center gap-3">
                  {project.status === 'active' ? (
                    <Clock className="h-4 w-4 text-primary" />
                  ) : project.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
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