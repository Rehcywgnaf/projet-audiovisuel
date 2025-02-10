import React from 'react';
import { 
  Activity,
  Users,
  Calendar,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserIcon
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTeams } from '@/hooks/useTeams';
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

const MemberCard = ({ member }: { member: any }) => (
  <div 
    className={cn(
      "flex items-center justify-between p-3 rounded-lg",
      "bg-muted/50 hover:bg-muted transition-colors"
    )}
  >
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {member.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Progress 
              value={100 - member.availability} 
              className="w-24"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{100 - member.availability}% occupé</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">
          {member.nextAvailable}
        </span>
      </div>
    </div>
  </div>
);

const TeamCard = ({ team }: { team: any }) => {
  const getOccupancyColor = (occupancy: number) => {
    if (occupancy > 80) return "text-destructive bg-destructive/10";
    if (occupancy > 50) return "text-warning bg-warning/10";
    return "text-success bg-success/10";
  };

  return (
    <Card className="hover:shadow transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <Badge variant="outline">
                {team.members.length} membres
              </Badge>
              <Badge variant="outline">
                {team.activeProjects} projets
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {team.name} • {team.activeProjects} projets actifs
            </p>
          </div>
          <Badge className={cn("ml-auto", getOccupancyColor(team.occupancy))}>
            {team.occupancy}% occupé
          </Badge>
        </div>

        <div className="space-y-2">
          {team.members.map((member: any) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectOccupancy = ({ project }: { project: any }) => {
  const getStatusIcon = (occupancy: number) => {
    if (occupancy > 80) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (occupancy > 50) return <Activity className="h-4 w-4 text-warning" />;
    return <CheckCircle2 className="h-4 w-4 text-success" />;
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg",
      "hover:bg-muted/50 transition-colors"
    )}>
      <div className="flex items-center gap-3">
        {getStatusIcon(project.avgOccupation)}
        <div>
          <p className="font-medium">{project.name}</p>
          <p className="text-sm text-muted-foreground">
            {project.members} membre{project.members > 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Progress 
              value={project.avgOccupation} 
              className="w-24"
              indicatorClassName={cn(
                project.avgOccupation > 80 ? "bg-destructive" :
                project.avgOccupation > 50 ? "bg-warning" :
                "bg-success"
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{Math.round(project.avgOccupation)}% occupé</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const TeamView = () => {
  const { teams, isLoading, error } = useTeams();

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

  if (!teams) return null;

  // Calcul des statistiques d'occupation
  const occupancyStats = teams.active.reduce(
    (acc, team) => {
      acc.total += team.occupancy;
      if (team.occupancy > 80) acc.overloaded++;
      return acc;
    },
    { total: 0, overloaded: 0 }
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Équipes Actives"
          value={teams.active.length}
          description={`${teams.activeMembers} membres actifs`}
        />
        <StatCard 
          title="Taux d'Occupation"
          value={`${Math.round(occupancyStats.total / teams.active.length)}%`}
          description={`${occupancyStats.overloaded} équipe${occupancyStats.overloaded > 1 ? 's' : ''} surchargée${occupancyStats.overloaded > 1 ? 's' : ''}`}
        />
        <StatCard 
          title="Effectif Total"
          value={teams.totalMembers}
        />
      </div>

      {/* Équipes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Équipes</CardTitle>
            </div>
            <Badge variant="outline">
              {teams.active.length} équipe{teams.active.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <CardDescription>
            Vue d'ensemble des équipes et leur charge de travail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {teams.active.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Occupation par Projet */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Occupation par Projet</CardTitle>
            </div>
          </div>
          <CardDescription>
            Répartition de la charge de travail par projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teams.active
              .flatMap(team => 
                team.members.flatMap(member => 
                  member.currentProjects.map(project => ({
                    project,
                    member: member.name,
                    occupation: 100 - member.availability
                  }))
                )
              )
              .reduce((acc, curr) => {
                const existingProject = acc.find(p => p.name === curr.project);
                if (existingProject) {
                  existingProject.members += 1;
                  existingProject.avgOccupation = 
                    (existingProject.avgOccupation * (existingProject.members - 1) + curr.occupation) 
                    / existingProject.members;
                } else {
                  acc.push({
                    name: curr.project,
                    members: 1,
                    avgOccupation: curr.occupation
                  });
                }
                return acc;
              }, [] as Array<{name: string, members: number, avgOccupation: number}>)
              .sort((a, b) => b.avgOccupation - a.avgOccupation)
              .map(project => (
                <ProjectOccupancy key={project.name} project={project} />
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamView;