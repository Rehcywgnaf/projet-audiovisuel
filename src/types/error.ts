import { Task } from './task';

export interface ErrorRecord {
  task: Task;
  retryCount: number;
  lastError: Error | null;
  nextRetryTime: Date | null;
}

export interface RetryStrategy {
  shouldRetry: (task: Task, record: ErrorRecord) => Promise<boolean>;
}