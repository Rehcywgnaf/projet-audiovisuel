import { Deadline } from './deadlineTypes';

export interface AIDeadlineSuggestion {
  priority?: Deadline['priority'];
  aiInsights?: string[];
  recommendedActions?: string[];
}

export function useAIDeadlineEnrichment() {
  const enrichDeadline = async (deadline: Deadline): Promise<Deadline & { aiSuggestion?: AIDeadlineSuggestion }> => {
    // Simulation du service IA (à remplacer par l'appel réel à AIServiceManager)
    const simulateAIEnrichment = (deadline: Deadline): AIDeadlineSuggestion => {
      const insights: Record<string, AIDeadlineSuggestion> = {
        'high': {
          priority: 'high',
          aiInsights: [
            'Deadline critique nécessitant une attention immédiate',
            'Risque élevé de manquer l\'opportunité'
          ],
          recommendedActions: [
            'Préparer immédiatement les documents',
            'Contacter l\'équipe pour accélérer le processus'
          ]
        },
        'medium': {
          priority: 'medium',
          aiInsights: [
            'Deadline à surveiller attentivement',
            'Temps suffisant pour une préparation détaillée'
          ],
          recommendedActions: [
            'Commencer la préparation des documents',
            'Planifier une réunion d\'équipe'
          ]
        },
        'low': {
          priority: 'low',
          aiInsights: [
            'Deadline avec une marge de temps confortable',
            'Opportunité de planification stratégique'
          ],
          recommendedActions: [
            'Débuter la recherche préliminaire',
            'Constituer un dossier préparatoire'
          ]
        }
      };

      return insights[deadline.priority] || {
        priority: deadline.priority,
        aiInsights: ['Aucune suggestion spécifique disponible'],
        recommendedActions: ['Continuer le suivi standard']
      };
    };

    // Logique d'enrichissement
    const aiSuggestion = simulateAIEnrichment(deadline);

    return {
      ...deadline,
      aiEnriched: true,
      aiSuggestion,
      history: [
        ...(deadline.history || []),
        {
          type: 'ai_suggestion',
          date: new Date().toISOString(),
          details: 'Enrichissement IA',
          changes: {
            aiPriority: { 
              old: deadline.priority, 
              new: aiSuggestion.priority || deadline.priority 
            }
          }
        }
      ]
    };
  };

  const filterCriticalDeadlines = (deadlines: Deadline[]): Deadline[] => {
    return deadlines.filter(deadline => 
      deadline.daysLeft <= 20 && !deadline.aiEnriched
    );
  };

  const batchEnrichDeadlines = async (deadlines: Deadline[]): Promise<Deadline[]> => {
    const criticalDeadlines = filterCriticalDeadlines(deadlines);
    
    const enrichedDeadlines = await Promise.all(
      criticalDeadlines.map(deadline => enrichDeadline(deadline))
    );

    // Merge enriched deadlines back into original array
    return deadlines.map(deadline => 
      enrichedDeadlines.find(enriched => enriched.id === deadline.id) || deadline
    );
  };

  return {
    enrichDeadline,
    batchEnrichDeadlines,
    filterCriticalDeadlines
  };
}
