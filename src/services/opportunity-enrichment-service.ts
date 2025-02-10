import { AIServiceManager } from '../services/ai-service-manager';

interface Opportunity {
  source: string;
  type: string;
  title: string;
  description: string;
  deadline?: string;
  budget?: string;
}

interface EnrichedOpportunity extends Opportunity {
  aiAnalysis: {
    relevanceScore: number;
    potentialFit: string[];
    keyRecommendations: string[];
    complexityLevel: 'low' | 'medium' | 'high';
  };
}

class OpportunityEnrichmentService {
  private aiService: AIServiceManager;

  constructor(aiServiceManager: AIServiceManager) {
    this.aiService = aiServiceManager;
  }

  async enrichOpportunities(opportunities: Opportunity[]): Promise<EnrichedOpportunity[]> {
    return Promise.all(
      opportunities.map(opp => this.enrichSingleOpportunity(opp))
    );
  }

  private async enrichSingleOpportunity(opportunity: Opportunity): Promise<EnrichedOpportunity> {
    try {
      // Appel à l'IA pour l'analyse
      const aiAnalysisResponse = await this.aiService.analyzeOpportunity({
        title: opportunity.title,
        description: opportunity.description,
        type: opportunity.type,
        budget: opportunity.budget
      });

      return {
        ...opportunity,
        aiAnalysis: {
          relevanceScore: aiAnalysisResponse.relevanceScore,
          potentialFit: aiAnalysisResponse.potentialFit,
          keyRecommendations: aiAnalysisResponse.keyRecommendations,
          complexityLevel: this.calculateComplexityLevel(aiAnalysisResponse.relevanceScore)
        }
      };
    } catch (error) {
      console.error('AI Enrichment Error:', error);
      
      // Fallback en cas d'erreur IA
      return {
        ...opportunity,
        aiAnalysis: {
          relevanceScore: 0,
          potentialFit: [],
          keyRecommendations: [],
          complexityLevel: 'low'
        }
      };
    }
  }

  private calculateComplexityLevel(relevanceScore: number): 'low' | 'medium' | 'high' {
    if (relevanceScore < 0.3) return 'low';
    if (relevanceScore < 0.7) return 'medium';
    return 'high';
  }

  // Filtrage des opportunités par score de pertinence
  filterRelevantOpportunities(
    enrichedOpportunities: EnrichedOpportunity[], 
    minRelevanceScore: number = 0.5
  ): EnrichedOpportunity[] {
    return enrichedOpportunities.filter(
      opp => opp.aiAnalysis.relevanceScore >= minRelevanceScore
    );
  }
}

export default OpportunityEnrichmentService;
export { Opportunity, EnrichedOpportunity };