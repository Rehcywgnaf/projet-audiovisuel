import React from 'react';
import { FolderOpen, Rss, Users } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useTeams } from '@/hooks/useTeams';
import { useRSS } from '@/hooks/useRSS';

const MainDashboard = () => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { teams, isLoading: teamsLoading } = useTeams();
  const { opportunities, isLoading: rssLoading } = useRSS();

  const isLoading = projectsLoading || teamsLoading || rssLoading;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {/* Statistiques Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Projets Actifs
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.active?.length || 0}</div>
            <div className="text-xs text-gray-500">
              {projects?.newThisMonth} ce mois
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Opportunités
            </CardTitle>
            <Rss className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities?.length || 0}</div>
            <div className="text-xs text-gray-500">
              {opportunities?.aap?.length || 0} AAP, {opportunities?.ao?.length || 0} AO
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Équipes Mobilisées
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams?.active?.length || 0}</div>
            <div className="text-xs text-gray-500">
              {teams?.activeMembers || 0} membres actifs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Principale */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vue Générale</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Jour</Button>
              <Button variant="outline" size="sm">Semaine</Button>
              <Button variant="outline" size="sm">Mois</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Ici, nous pourrons intégrer les composants de visualisation de données */}
        </CardContent>
      </Card>

      {/* Section Inférieure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projets Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.recent?.map((project) => (
                <div key={project.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-gray-500">
                      Mise à jour {project.lastUpdateRelative}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Voir</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activité Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams?.active?.map((team) => (
                <div key={team.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-500">
                        {team.activeProjects} projets en cours
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{team.occupancy}% occupé</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MainDashboard;