import React from 'react';
import { 
  Activity,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjects } from '@/hooks/useProjects';
import { useTeams } from '@/hooks/useTeams';
import { cn } from "@/lib/utils";

const CalendarDay = ({ 
  day,
  isCurrentMonth = false,
  deadlines = [],
  date = new Date()
}: { 
  day: number;
  isCurrentMonth?: boolean;
  deadlines?: any[];
  date?: Date;
}) => (
  <div className={cn(
    "bg-card p-2 min-h-24 hover:bg-accent/50 transition-colors",
    !isCurrentMonth && "text-muted-foreground"
  )}>
    <div className="font-medium mb-1">{isCurrentMonth ? day : ''}</div>
    {isCurrentMonth && deadlines.length > 0 && (
      <ScrollArea className="h-20">
        <div className="space-y-1 pr-2">
          {deadlines.map(project => (
            <TooltipProvider key={project.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "text-xs p-1.5 rounded-md truncate cursor-pointer",
                    project.progress === 100
                      ? "bg-success/20 text-success hover:bg-success/30"
                      : date < new Date()
                      ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                      : "bg-primary/20 text-primary hover:bg-primary/30"
                  )}>
                    {project.title}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm space-y-1">
                    <p>{project.title}</p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={project.progress} 
                        className="w-16 h-1.5" 
                      />
                      <span className="text-xs">{project.progress}%</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    )}
  </div>
);

const DeadlineItem = ({ project }: { project: any }) => {
  const deadline = new Date(project.deadline);
  const isLate = deadline < new Date();
  const isToday = deadline.toDateString() === new Date().toDateString();

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg",
      "hover:bg-accent/50 transition-colors"
    )}>
      <div className="flex items-center gap-3">
        {project.progress === 100 ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : isLate ? (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        ) : isToday ? (
          <Clock className="h-4 w-4 text-warning" />
        ) : (
          <CalendarIcon className="h-4 w-4 text-primary" />
        )}
        <div>
          <h4 className="font-medium">{project.title}</h4>
          <div className="flex items-center gap-2">
            <Progress 
              value={project.progress} 
              className="w-16 h-1.5" 
            />
            <span className="text-xs text-muted-foreground">
              {project.progress}%
            </span>
          </div>
        </div>
      </div>
      <Badge variant={
        isLate 
          ? "destructive"
          : isToday
          ? "warning"
          : "secondary"
      }>
        {isLate 
          ? 'En retard'
          : isToday
          ? "Aujourd'hui"
          : deadline.toLocaleDateString()}
      </Badge>
    </div>
  );
};

const PlanningView = () => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { teams, isLoading: teamsLoading } = useTeams();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  if (projectsLoading || teamsLoading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!projects || !teams) return null;

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  // Obtenir les deadlines du mois
  const monthDeadlines = projects.active
    .filter(project => {
      const deadline = new Date(project.deadline);
      return deadline.getMonth() === currentMonth.getMonth() &&
             deadline.getFullYear() === currentMonth.getFullYear();
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="space-y-8">
      {/* En-tête du Calendrier */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">
            {currentMonth.toLocaleDateString('fr-FR', { 
              month: 'long',
              year: 'numeric'
            })}
          </h2>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <Badge variant="outline">
          {monthDeadlines.length} deadlines
        </Badge>
      </div>

      {/* Calendrier */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-px bg-border">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div 
                key={day}
                className="bg-card p-2 text-center text-sm font-medium"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 42 }, (_, i) => {
              const dayNumber = i - firstDayOfMonth + 1;
              const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                dayNumber
              );

              const dayDeadlines = monthDeadlines.filter(project => {
                const deadline = new Date(project.deadline);
                return deadline.getDate() === dayNumber;
              });

              return (
                <CalendarDay 
                  key={i}
                  day={dayNumber}
                  isCurrentMonth={isCurrentMonth}
                  deadlines={dayDeadlines}
                  date={date}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des Deadlines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Deadlines à Venir</CardTitle>
            </div>
            <Badge variant="outline">
              {projects.active.length} projets
            </Badge>
          </div>
          <CardDescription>
            Liste des projets triés par date d'échéance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {projects.active
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .map(project => (
                  <DeadlineItem key={project.id} project={project} />
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningView;