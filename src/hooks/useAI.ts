import { useState, useCallback } from 'react';
import AIServiceManager from '../lib/AIServiceManager';
import { type AIRequest, type AIResponse } from '../lib/types';

interface UseAIResult {
  isLoading: boolean;
  error: Error | null;
  result: AIResponse | null;
  execute: (operation: string, options?: AIRequest['options']) => Promise<void>;
  stats: {
    totalCost: number;
    requests: number;
    cacheHits: number;
  } | null;
  clearError: () => void;
}

export function useAI(service: string): UseAIResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [stats, setStats] = useState<UseAIResult['stats']>(null);

  const execute = useCallback(async (operation: string, options?: AIRequest['options']) => {
    setIsLoading(true);
    setError(null);
    try {
      const aiManager = AIServiceManager.getInstance();
      const response = await aiManager.processRequest(service, operation, options);
      setResult(response);
      
      // Mise à jour des stats
      const serviceStats = aiManager.getStats(service);
      if (serviceStats) {
        setStats({
          totalCost: serviceStats.totalCost,
          requests: serviceStats.totalRequests,
          cacheHits: serviceStats.cacheHits
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isLoading, error, result, execute, stats, clearError };
}