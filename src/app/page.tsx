'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import GlobalDashboard from '@/components/dashboard/global/Dashboard';
import DriveAuthPage from './drive/auth/page';
import DriveIntegrationPage from './drive/integration/page';
import { useDrive } from './drive/provider/page';

function DashboardContent() {
  const { isAuthenticated } = useDrive();

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="drive" disabled={!isAuthenticated}>Drive</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        {isAuthenticated ? (
          <GlobalDashboard />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DriveAuthPage />
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="drive">
        {isAuthenticated ? (
          <DriveIntegrationPage />
        ) : (
          <Card className="p-6">
            Veuillez vous connecter à Google Drive pour accéder à l'intégration.
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="settings">
        <Card className="p-6">
          Paramètres à venir...
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function Home() {
  return (
    <main className="p-4 space-y-8">
      <DashboardContent />
    </main>
  );
}