import { createContext, useContext } from 'react';

// Types pour les opportunités
export interface Opportunity {
  id: number;
  type: 'AAP' | 'AO';
  title: string;
  budget: string;
  deadline: string;
  match: number;
  description?: string;
  source?: string;
  category?: string;
  requirements?: string[];
}

interface VeilleContextType {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: Error | null;
  refreshOpportunities: () => Promise<void>;
  filterOpportunities: (criteria: FilterCriteria) => Promise<void>;
}

// Types pour les filtres
export interface FilterCriteria {
  type?: 'AAP' | 'AO';
  minBudget?: number;
  maxBudget?: number;
  minMatch?: number;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Service de veille
export class VeilleService {
  static async fetchOpportunities(filters?: FilterCriteria): Promise<Opportunity[]> {
    try {
      // TODO: Remplacer par l'appel API réel
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des opportunités');
      }

      const data = await response.json();
      return data.opportunities;
    } catch (error) {
      console.error('Erreur VeilleService:', error);
      throw error;
    }
  }

  static async getOpportunityDetails(id: number): Promise<Opportunity> {
    try {
      const response = await fetch(`/api/opportunities/${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur détails opportunité:', error);
      throw error;
    }
  }

  static matchScore(opportunity: Opportunity): number {
    // TODO: Implémenter l'algorithme de scoring réel
    let score = 0;
    
    // Critères de base
    if (opportunity.budget) score += 30;
    if (opportunity.deadline) score += 20;
    if (opportunity.requirements) score += 30;
    if (opportunity.description) score += 20;

    return score;
  }
}

// Context pour la veille
export const VeilleContext = createContext<VeilleContextType | undefined>(undefined);

export function useVeille() {
  const context = useContext(VeilleContext);
  if (context === undefined) {
    throw new Error('useVeille doit être utilisé dans un VeilleProvider');
  }
  return context;
}