import { QueueMetricsManager } from '@/monitoring/core/metrics/queueMetrics';

/**
 * @deprecated Use QueueMetricsManager from @/monitoring/core/metrics/queueMetrics instead
 * This file is maintained for backwards compatibility and will be removed in future versions
 */
export class QueueMonitor {
  private metricsManager = QueueMetricsManager.getInstance();

  /**
   * @deprecated Use QueueMetricsManager.updateQueueMetrics instead
   */
  updateMetrics(queueSizes: { high: number; standard: number; low: number }) {
    console.warn('QueueMonitor is deprecated. Use QueueMetricsManager instead.');
    this.metricsManager.updateAllQueueMetrics(queueSizes);
  }

  /**
   * @deprecated Use QueueMetricsManager.addListener instead
   */
  onAlert(listener: any) {
    console.warn('QueueMonitor.onAlert is deprecated. Use QueueMetricsManager instead.');
    return () => {}; // NOOP for compatibility
  }

  /**
   * @deprecated Use QueueMetricsManager.getAllQueueMetrics instead
   */
  getMetrics() {
    console.warn('QueueMonitor.getMetrics is deprecated. Use QueueMetricsManager instead.');
    return this.metricsManager.getAllQueueMetrics();
  }
}