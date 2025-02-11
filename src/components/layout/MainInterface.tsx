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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProjectsView from '@/components/views/ProjectsView';
import OpportunitiesView from '@/components/views/OpportunitiesView';
import TeamView from '@/components/views/TeamView';
import PlanningView from '@/components/views/PlanningView';
import { cn } from "@/lib/utils";

type View = 'projects' | 'rss' | 'teams' | 'planning';

const NavButton = ({ 
  selected, 
  icon: Icon, 
  children, 
  onClick 
}: { 
  selected: boolean; 
  icon: any; 
  children: React.ReactNode; 
  onClick: () => void;
}) => (
  <Button 
    variant={selected ? "default" : "ghost"} 
    className={cn(
      "w-full justify-start gap-2",
      selected && "bg-primary text-primary-foreground hover:bg-primary/90"
    )}
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    {children}
  </Button>
);

const MainInterface = () => {
  const [currentView, setCurrentView] = useState<View>('rss');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'projects':
        return <ProjectsView />;
      case 'rss':
        return <OpportunitiesView />;
      case 'teams':
        return <TeamView />;
      case 'planning':
        return <PlanningView />;
      default:
        return <ProjectsView />;
    }
  };

  const Navigation = () => (
    <nav className="space-y-2">
      <NavButton 
        selected={currentView === 'projects'} 
        icon={FolderOpen}
        onClick={() => setCurrentView('projects')}
      >
        Projets
      </NavButton>
      <NavButton 
        selected={currentView === 'rss'} 
        icon={Rss}
        onClick={() => setCurrentView('rss')}
      >
        Veille
      </NavButton>
      <NavButton 
        selected={currentView === 'teams'} 
        icon={Users}
        onClick={() => setCurrentView('teams')}
      >
        Équipes
      </NavButton>
      <NavButton 
        selected={currentView === 'planning'} 
        icon={Calendar}
        onClick={() => setCurrentView('planning')}
      >
        Planning
      </NavButton>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <div className="hidden md:fixed md:flex md:w-64 md:flex-col md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-border bg-card px-6 pb-4">
          <div className="flex h-16 items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SAPAV</span>
          </div>
          <ScrollArea className="flex-1 -mx-4 px-4">
            <Navigation />
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-6">
          <SheetHeader className="mb-8">
            <SheetTitle className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              SAPAV
            </SheetTitle>
          </SheetHeader>
          <Navigation />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Activity className="h-6 w-6" />
          </Button>
          <div className="flex flex-1 items-center gap-4">
            <form className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un projet, une équipe..." 
                  className="pl-8"
                />
              </div>
            </form>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default MainInterface;