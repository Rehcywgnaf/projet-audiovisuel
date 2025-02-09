import { useState, useCallback } from 'react';
import { AIInteractionType } from '@/lib/AIServiceManager';

export interface AIRequestParams {
  type: AIInteractionType;
  messages: Array<{ 
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
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
    interactionType: AIInteractionType;
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

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'AI request failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.warn('AI Analysis failed:', err);
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