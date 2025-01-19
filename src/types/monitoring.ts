export interface QueueMetrics {
  high: QueueStatus;
  standard: QueueStatus;
  low: QueueStatus;
}

export interface QueueStatus {
  size: number;
  oldestTask: Task | null;
}

export interface QueueAlert {
  type: 'QUEUE_SIZE' | 'WAIT_TIME';
  priority: string;
  message: string;
}