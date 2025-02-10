import { useState, useEffect } from 'react';
import { rssProjectService } from '@/services/RSSProjectService';
import { AIServiceManager } from '@/lib/AIServiceManager';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'AAP' | 'AO';
  source: string;
  deadline: Date;
  budget: {
    min?: number;
    max?: number;
  };
  score: number;
  matchingCriteria: string[];
}

interface OpportunitiesData {
  aap: Opportunity[];
  ao: Opportunity[];
  length: number;
  recent: Opportunity[];
}

export const useRSS = () => {
  const [opportunities, setOpportunities] = useState<OpportunitiesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        const sources = await rssProjectService.getSources();
        const opportunities = await rssProjectService.getOpportunities();

        // Analyse IA pour le scoring des opportunités
        const aiManager = AIServiceManager.getInstance();
        const enrichedOpportunities = await Promise.all(
          opportunities.map(async (opp) => {
            try {
              const analysis = await aiManager.generateContent({
                type: 'OPPORTUNITY_ANALYSIS',
                messages: [{
                  role: 'user',
                  content: `Analyze opportunity match: ${JSON.stringify(opp)}`
                }],
                maxTokens: 100
              });

              return {
                ...opp,
                score: analysis.score || 0,
                matchingCriteria: analysis.criteria || []
              };
            } catch (error) {
              console.warn(`Failed to analyze opportunity ${opp.id}:`, error);
              return {
                ...opp,
                score: 0,
                matchingCriteria: []
              };
            }
          })
        );

        // Traitement des données
        const processedData: OpportunitiesData = {
          aap: enrichedOpportunities.filter(o => o.type === 'AAP'),
          ao: enrichedOpportunities.filter(o => o.type === 'AO'),
          length: enrichedOpportunities.length,
          recent: enrichedOpportunities
            .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
            .slice(0, 5)
        };

        setOpportunities(processedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des opportunités');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return { opportunities, isLoading, error };
};