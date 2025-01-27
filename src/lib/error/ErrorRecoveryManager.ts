import { Task, ErrorRecord, RetryStrategy } from '@/types';

export class ErrorRecoveryManager {
  private readonly maxRetries = 3;
  private retryQueue: Map<string, ErrorRecord> = new Map();
  private strategies: Map<string, RetryStrategy> = new Map();

  registerStrategy(errorType: string, strategy: RetryStrategy) {
    this.strategies.set(errorType, strategy);
  }

  async handleError(task: Task, error: Error): Promise<boolean> {
    const errorRecord = this.getOrCreateErrorRecord(task);
    
    if (errorRecord.retryCount >= this.maxRetries) {
      this.handleFatalError(task, error);
      return false;
    }

    const strategy = this.getStrategy(error);
    if (strategy) {
      const shouldRetry = await strategy.shouldRetry(task, errorRecord);
      if (shouldRetry) {
        return this.scheduleRetry(task, errorRecord);
      }
    }

    this.handleFatalError(task, error);
    return false;
  }

  private getOrCreateErrorRecord(task: Task): ErrorRecord {
    if (!this.retryQueue.has(task.id)) {
      this.retryQueue.set(task.id, {
        task,
        retryCount: 0,
        lastError: null,
        nextRetryTime: null
      });
    }
    return this.retryQueue.get(task.id)!;
  }

  private getStrategy(error: Error): RetryStrategy | null {
    for (const [errorType, strategy] of this.strategies.entries()) {
      if (error.message.includes(errorType)) {
        return strategy;
      }
    }
    return null;
  }

  private async scheduleRetry(task: Task, record: ErrorRecord): Promise<boolean> {
    record.retryCount++;
    record.nextRetryTime = this.calculateNextRetryTime(record.retryCount);
    
    this.emitRetryEvent({
      taskId: task.id,
      retryCount: record.retryCount,
      nextRetryTime: record.nextRetryTime,
      reason: record.lastError?.message || 'Unknown error'
    });

    return true;
  }

  private calculateNextRetryTime(retryCount: number): Date {
    const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 3600000);
    return new Date(Date.now() + delay);
  }

  private handleFatalError(task: Task, error: Error) {
    this.emitFatalErrorEvent({
      taskId: task.id,
      error: error.message,
      retryCount: this.retryQueue.get(task.id)?.retryCount || 0
    });
    
    this.retryQueue.delete(task.id);
  }

  private emitRetryEvent(data: any) {
    const event = new CustomEvent('taskRetry', { detail: data });
    window.dispatchEvent(event);
  }

  private emitFatalErrorEvent(data: any) {
    const event = new CustomEvent('taskFatalError', { detail: data });
    window.dispatchEvent(event);
  }

  getRetryQueueStatus() {
    return {
      size: this.retryQueue.size,
      tasks: Array.from(this.retryQueue.values())
    };
  }
}