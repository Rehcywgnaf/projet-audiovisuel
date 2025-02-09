import { useState, useCallback } from 'react';
import { AIInteractionType } from '@/lib/AIServiceManager';

export interface AIRequestParams {
  type?: AIInteractionType;
  messages: Array<{ 
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  performanceMetrics?: {
    maxResponseTime?: number;
    priorityLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export interface AIResponse {
  content: string;
  model: string;
  tokens: {
    input: number;
    output: number;
  };
  metadata: {
    timestamp: string;
    interactionType?: AIInteractionType;
    performanceMetrics?: Record<string, any>;
  };
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (params: AIRequestParams): Promise<AIResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validation des paramètres
      if (!params.messages || params.messages.length === 0) {
        throw new Error('Aucun message fourni pour l\'analyse AI');
      }

      // Appel API serveur pour les requêtes AI
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.details || 'Erreur lors de la requête AI');
      }

      const responseData = await response.json();
      return responseData;
    } catch (err) {
      let errorMessage = 'Erreur inconnue lors de l\'analyse AI';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Détails de l\'erreur AI:', {
          message: err.message,
          stack: err.stack
        });
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      console.warn('AI Analysis failed:', errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateContent,
    isLoading,
    error
  };
}