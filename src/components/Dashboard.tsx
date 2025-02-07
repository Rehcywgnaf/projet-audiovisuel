import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import EnhancedProjectList, { Project } from './EnhancedProjectList';

// Type pour les statistiques du dashboard
type DashboardStats = {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
};

export default function Dashboard({
  projects,
  stats,
}: {
  projects: Project[];
  stats: DashboardStats;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projets Terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.completedProjects}</p>
          </CardContent>
        </Card>
      </div>

      {/* Remplacement de ProjectList par EnhancedProjectList */}
      <EnhancedProjectList projects={projects} />
    </div>
  );
}