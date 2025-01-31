import React from 'react';
import { Dashboard } from '@/components/team/ui/dashboard';
import { TeamManager } from '@/components/team/core/TeamManager';

// Initialisation du TeamManager pour la page
const teamManager = new TeamManager();

export default function TeamsPage() {
  return (
    <div className="container mx-auto p-6">
      <Dashboard teamManager={teamManager} />
    </div>
  );
}