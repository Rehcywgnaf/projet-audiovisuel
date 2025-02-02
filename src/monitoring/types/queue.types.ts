import { MetricStatus } from './metrics.types';

export interface QueueTask {
  id: string;
  timestamp: number;
  priority: QueuePriority;
  type: string;
}

export type QueuePriority = 'high' | 'standard' | 'low';

export interface QueueMetricsData {
  size: number;
  oldestTask: QueueTask | null;
  status: MetricStatus;
  waitTime?: number;
}

export interface QueueAlert {
  id: string;
  type: 'QUEUE_SIZE' | 'WAIT_TIME';
  priority: QueuePriority;
  message: string;
  timestamp: Date;
}

export interface QueueState {
  [priority: string]: QueueMetricsData;
}

export interface QueueThresholds {
  size: number;
  waitTime: number; // en secondes
}