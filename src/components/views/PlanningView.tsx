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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useTeams } from '@/hooks/useTeams';

const PlanningView = () => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { teams, isLoading: teamsLoading } = useTeams();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  if (projectsLoading || teamsLoading) {
    return <div className="h-full w-full flex items-center justify-center">
      <Activity className="h-8 w-8 animate-spin text-blue-600" />
    </div>;
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
    <div className="space-y-6">
      {/* En-tête du Calendrier */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">
            {currentMonth.toLocaleDateString('fr-FR', { 
              month: 'long',
              year: 'numeric'
            })}
          </h2>
          <Button variant="ghost" onClick={handleNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {monthDeadlines.length} deadlines ce mois
          </span>
        </div>
      </div>

      {/* Calendrier */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div 
                key={day}
                className="bg-white p-2 text-center text-sm font-medium"
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
                <div
                  key={i}
                  className={`bg-white p-2 min-h-24 ${
                    isCurrentMonth ? '' : 'text-gray-400'
                  }`}
                >
                  <div className="font-medium mb-1">{isCurrentMonth ? dayNumber : ''}</div>
                  <div className="space-y-1">
                    {dayDeadlines.map(project => (
                      <div
                        key={project.id}
                        className={`text-xs p-1 rounded truncate ${
                          project.progress === 100
                            ? 'bg-green-100 text-green-800'
                            : date < new Date()
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {project.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Deadlines à Venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {projects.active
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .map(project => {
                const deadline = new Date(project.deadline);
                const isLate = deadline < new Date();
                const isToday = deadline.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {project.progress === 100 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : isLate ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : isToday ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-500">
                          {project.progress}% complété
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className={`text-sm ${
                        isLate 
                          ? 'text-red-600'
                          : isToday
                          ? 'text-yellow-600'
                          : 'text-gray-500'
                      }`}>
                        {isLate 
                          ? 'En retard'
                          : isToday
                          ? "Aujourd'hui"
                          : deadline.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningView;