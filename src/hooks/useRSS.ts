import { useState, useEffect } from 'react';
import { rssProjectService, RSSSource } from '@/services/RSSProjectService';
import { veilleService, Opportunity } from '@/services/VeilleService';
import AIServiceManager from '@/lib/AIServiceManager';

export interface RSSData {
  sources: RSSSource[];
  opportunities: Opportunity[];
  aap: Opportunity[];
  ao: Opportunity[];
  recent: Opportunity[];
  stats: {
    totalActive: number;
    totalPending: number;
    totalError: number;
  };
}

export const useRSS = () => {
  const [rssData, setRssData] = useState<RSSData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSData = async () => {
      try {
        setIsLoading(true);
        const sources = rssProjectService.getSources();
        const opportunities = await veilleService.getOpportunities();

        // Classification et enrichissement des opportunités
        const aiManager = AIServiceManager.getInstance();
        const enrichedOpportunities = await Promise.all(
          opportunities.map(async (opp) => {
            try {
              const analysis = await aiManager.generateContent({
                type: 'OPPORTUNITY_ANALYSIS',
                messages: [{
                  role: 'user',
                  content: `Analyze opportunity details: ${JSON.stringify(opp)}`
                }],
                maxTokens: 100
              });

              return {
                ...opp,
                analysis: {
                  score: analysis.score || 0,
                  category: analysis.category || 'Non catégorisé',
                  keywords: analysis.keywords || []
                }
              };
            } catch (error) {
              console.warn(`Failed to analyze opportunity ${opp.id}:`, error);
              return opp;
            }
          })
        );

        // Organisation des données
        const processedData: RSSData = {
          sources,
          opportunities: enrichedOpportunities,
          aap: enrichedOpportunities.filter(o => o.type === 'AAP'),
          ao: enrichedOpportunities.filter(o => o.type === 'AO'),
          recent: enrichedOpportunities
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .slice(0, 5),
          stats: {
            totalActive: sources.filter(s => s.status === 'active').length,
            totalPending: sources.filter(s => s.status === 'pending').length,
            totalError: sources.filter(s => s.status === 'error').length
          }
        };

        setRssData(processedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des données RSS');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRSSData();
  }, []);

  return { rssData, isLoading, error };
};