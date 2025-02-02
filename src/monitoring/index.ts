// Core exports
export { BaseMetricsManager } from './core/metrics/baseMetrics';
export { QueueMetricsManager } from './core/metrics/queueMetrics';
export { MonitoringService } from './core/MonitoringService';

// Types exports
export * from './types/metrics.types';
export * from './types/queue.types';

// Singleton instance exports
export const monitoringService = MonitoringService.getInstance();
export const queueMetrics = QueueMetricsManager.getInstance();