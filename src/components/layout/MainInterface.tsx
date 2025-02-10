import React, { useState } from 'react';
import { 
  Activity, 
  FolderOpen, 
  Users, 
  Settings, 
  Rss,
  Bell,
  Calendar,
  Search
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProjectsView from '@/components/views/ProjectsView';

interface MainInterfaceProps {
  children?: React.ReactNode;
}

const MainInterface: React.FC<MainInterfaceProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Latérale */}
      <div className="fixed w-64 h-full bg-white border-r shadow-sm p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">SAPAV</span>
        </div>

        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <FolderOpen className="mr-2 h-5 w-5" />
            Projets
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Rss className="mr-2 h-5 w-5" />
            Veille
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-5 w-5" />
            Équipes
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2 h-5 w-5" />
            Planning
          </Button>
        </nav>
      </div>

      {/* Contenu Principal */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 max-w-xl">
            <Input 
              placeholder="Rechercher un projet, une équipe..." 
              className="w-full"
              prefix={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenu dynamique */}
        {children || <ProjectsView />}
      </div>
    </div>
  );
};

export default MainInterface;