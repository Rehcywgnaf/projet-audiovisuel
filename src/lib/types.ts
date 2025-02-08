export type ClaudeModel = 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307';

export interface AIServiceStats {
  cacheHits: number;
  totalRequests: number;
  averageLatency: number;
  lastProcessed: Date;
  totalCost: number;
}

export interface AIRequest {
  service: string;
  operation: string;
  data?: any;
  options?: {
    priority?: 'low' | 'medium' | 'high';
    cache?: boolean;
    complexity?: 'simple' | 'complex';
    timeConstraint?: 'strict' | 'flexible';
    contextRequired?: boolean;
    maxTokens?: number;
  };
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  cost?: number;
  model?: ClaudeModel;
}

export interface AIServiceConfig {
  apiKey: string;
  defaultModel: ClaudeModel;
  maxCost: number;
  warningThreshold: number;
}