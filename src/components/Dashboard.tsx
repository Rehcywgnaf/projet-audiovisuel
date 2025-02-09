import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, FolderOpen, Activity, CheckCircle2, Rss, Users } from 'lucide-react';
import EnhancedProjectList from './EnhancedProjectList';
import { projectService } from '@/services/ProjectService';
import RSSService, { RSSOpportunity } from '@/services/RSSService';
import TeamService, { TeamMember } from '@/services/TeamService';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { StatsCard } from './ui/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [rssOpportunities, setRSSOpportunities] = useState<RSSOpportunity[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    rssOpportunitiesCount: 0,
    teamMembersCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Récupération parallèle des données
      const [
        projectsData, 
        projectStats, 
        rssData, 
        teamData
      ] = await Promise.all([
        projectService.getProjects(),
        projectService.getProjectStats(),
        RSSService.getInstance().getRelevantOpportunities(),
        TeamService.getInstance().getTeamMembers()
      ]);

      setProjects(projectsData);
      setRSSOpportunities(rssData);
      setTeamMembers(teamData);
      
      setStats({
        ...projectStats,
        rssOpportunitiesCount: rssData.length,
        teamMembersCount: teamData.length
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
        {/* Opportunités RSS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rss className="w-5 h-5" /> 
              Opportunités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : rssOpportunities.length > 0 ? (
              <ul className="space-y-2">
                {rssOpportunities.slice(0, 5).map(opp => (
                  <li key={opp.id} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{opp.title}</h3>
                        <p className="text-xs text-gray-500">{opp.source}</p>
                      </div>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        Score: {(opp.relevanceScore || 0).toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Aucune opportunité disponible</p>
            )}
          </CardContent>
        </Card>

        {/* Équipe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> 
              Membres de l'Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : teamMembers.length > 0 ? (
              <ul className="space-y-2">
                {teamMembers.map(member => (
                  <li key={member.id} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-sm">{member.name}</h3>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          member.availability > 80 ? 'bg-green-50 text-green-600' :
                          member.availability > 40 ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {member.availability}% disponible
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Aucun membre d'équipe</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Liste des Projets */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-500 mb-4">Aucun projet disponible</p>
          <Button 
            onClick={fetchDashboardData} 
            variant="outline"
            size="sm"
          >
            <Loader2 className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      ) : (
        <EnhancedProjectList projects={projects} />
      )}
    </div>
  );
}