import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Navigation } from '../../team/ui/dashboard/Navigation';
import { KPIs } from '../../team/ui/dashboard/KPIs';
import { TeamManager } from '@/components/team/core/TeamManager';
import { useTeamTracking } from '@/components/team/ui/tracking/hooks';
import AIServiceManager, { AIInteractionType } from '@/lib/AIServiceManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeamDashboardProps {
  teamManager: TeamManager;
}

export default function TeamDashboard({ teamManager }: TeamDashboardProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>();
  const { teams, loading, error } = useTeamTracking(teamManager);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const filteredTeams = selectedTeamId 
    ? teams.filter(team => team.id === selectedTeamId)
    : teams;

  useEffect(() => {
    const getAISuggestions = async () => {
      if (!teams.length || loading) return;

      try {
        setAiLoading(true);
        const aiManager = AIServiceManager.getInstance();
        const analysis = await aiManager.generateContent({
          type: AIInteractionType.TEAM_OPTIMIZATION,
          messages: [
            {
              role: 'user',
              content: `Analyze team performance and suggest optimizations. Teams data: ${JSON.stringify(teams)}. ${
                selectedTeamId ? `Focus on team: ${selectedTeamId}` : 'Provide overview for all teams.'
              }`
            }
          ],
          maxTokens: 400,
          temperature: 0.4,
          performanceMetrics: {
            maxResponseTime: 2000,
            priorityLevel: 'MEDIUM'
          }
        });

        setAiSuggestions(analysis.content);
      } catch (error) {
        console.warn('AI Analysis failed:', error);
        setAiSuggestions(null);
      } finally {
        setAiLoading(false);
      }
    };

    getAISuggestions();
  }, [teams, selectedTeamId, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 p-4">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Navigation 
        teams={teams}
        selectedTeamId={selectedTeamId}
        onTeamSelect={setSelectedTeamId}
      />
      
      {/* AI Suggestions Section */}
      {aiSuggestions && (
        <Card className="bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            {aiLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            ) : (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
            <h3 className="font-medium">Suggestions d'Optimisation IA</h3>
          </div>
          <Alert>
            <AlertDescription className="text-sm">
              {aiSuggestions}
            </AlertDescription>
          </Alert>
        </Card>
      )}
      
      <KPIs teams={filteredTeams} />
    </div>
  );
}