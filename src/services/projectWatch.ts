import { brave_web_search } from '@/lib/search';

export type ProjectOpportunity = {
  title: string;
  url: string;
  description: string;
  criteria: {
    budget?: string;
    deadline?: string;
    type?: string;
  };
  matchScore: number;
};

export async function searchNewOpportunities(): Promise<ProjectOpportunity[]> {
  const results = await brave_web_search({
    query: 'appel à projets audiovisuel documentaire financement',
    count: 10
  });

  return results.map(result => ({
    title: result.title,
    url: result.url,
    description: result.description,
    criteria: extractCriteria(result.description),
    matchScore: calculateMatchScore(result)
  }));
}

function extractCriteria(text: string) {
  // Analyse du texte pour extraire budget, deadline, type
  return {
    budget: extractBudget(text),
    deadline: extractDeadline(text),
    type: extractType(text)
  };
}

function calculateMatchScore(result: any): number {
  // Algorithme de scoring basé sur les critères
  return Math.floor(Math.random() * 40) + 60; // Mock pour l'instant
}
