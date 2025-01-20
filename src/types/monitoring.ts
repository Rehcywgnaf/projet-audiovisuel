export interface QueueMetrics {
  queueSizes: {
    timestamp: string;
    high: number;
    standard: number;
    low: number;
    total: number;
  }[];
  errorRates: {
    timestamp: string;
    rate: number;
  }[];
  retryAttempts: {
    timestamp: string;
    count: number;
  }[];
}

export interface QueueAlert {
  id: string;
  type: 'warning' | 'error';
  message: string;
  timestamp: Date;
  priority: 'high' | 'standard' | 'low';
}

export interface MonitoringMetrics extends QueueMetrics {
  activeAlerts: QueueAlert[];
}