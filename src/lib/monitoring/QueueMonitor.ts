import { Task, QueueMetrics, QueueAlert } from '@/types';

export class QueueMonitor {
  private readonly alertThresholds = {
    high: { size: 10, waitTime: 300 },    // 5 minutes
    standard: { size: 20, waitTime: 900 }, // 15 minutes
    low: { size: 30, waitTime: 1800 }     // 30 minutes
  };

  private metrics: QueueMetrics = {
    high: { size: 0, oldestTask: null },
    standard: { size: 0, oldestTask: null },
    low: { size: 0, oldestTask: null }
  };

  private listeners: ((alert: QueueAlert) => void)[] = [];

  updateMetrics(queueSizes: { high: number; standard: number; low: number }, 
                oldestTasks: { high: Task | null; standard: Task | null; low: Task | null }) {
    this.metrics = {
      high: { size: queueSizes.high, oldestTask: oldestTasks.high },
      standard: { size: queueSizes.standard, oldestTask: oldestTasks.standard },
      low: { size: queueSizes.low, oldestTask: oldestTasks.low }
    };

    this.checkThresholds();
  }

  private checkThresholds() {
    Object.entries(this.metrics).forEach(([priority, data]) => {
      const threshold = this.alertThresholds[priority as keyof typeof this.alertThresholds];
      
      if (data.size > threshold.size) {
        this.emitAlert({
          type: 'QUEUE_SIZE',
          priority: priority,
          message: `Queue ${priority} size (${data.size}) exceeds threshold (${threshold.size})`
        });
      }

      if (data.oldestTask) {
        const waitTime = (Date.now() - data.oldestTask.timestamp) / 1000;
        if (waitTime > threshold.waitTime) {
          this.emitAlert({
            type: 'WAIT_TIME',
            priority: priority,
            message: `Task in ${priority} queue waiting for ${Math.floor(waitTime / 60)}min`
          });
        }
      }
    });
  }

  onAlert(listener: (alert: QueueAlert) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emitAlert(alert: QueueAlert) {
    this.listeners.forEach(listener => listener(alert));
  }

  getMetrics(): QueueMetrics {
    return { ...this.metrics };
  }
}