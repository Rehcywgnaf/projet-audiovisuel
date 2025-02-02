import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, usePathname } from 'next/navigation';

interface MonitoringLayoutProps {
  children: React.ReactNode;
}

const MonitoringLayout = ({ children }: MonitoringLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Déterminer l'onglet actif en fonction du pathname
  const getCurrentTab = () => {
    if (pathname.includes('/ai')) return 'ai';
    if (pathname.includes('/projects')) return 'projects';
    return 'general';
  };

  // Gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'general':
        router.push('/monitoring');
        break;
      case 'ai':
        router.push('/monitoring/ai');
        break;
      case 'projects':
        router.push('/monitoring/projects');
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-4">Monitoring SAPAV</h1>
        <Tabs defaultValue={getCurrentTab()} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="general">Vue Générale</TabsTrigger>
            <TabsTrigger value="ai">Performance IA</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default MonitoringLayout;