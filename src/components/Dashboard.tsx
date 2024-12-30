import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ProjectList from './ProjectList';

type Project = {
  id: string;
  title: string;
  organization: string;
  status: 'active' | 'pending' | 'completed';
  updatedAt: string;
};

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
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.completedProjects}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectList projects={projects} />
        </CardContent>
      </Card>
    </div>
  );
}