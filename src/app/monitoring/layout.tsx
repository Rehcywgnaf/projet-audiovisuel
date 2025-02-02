import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MonitoringLayoutProps {
  children: React.ReactNode;
}

const MonitoringLayout = ({ children }: MonitoringLayoutProps) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-4">Monitoring SAPAV</h1>
        <Tabs defaultValue="general">
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