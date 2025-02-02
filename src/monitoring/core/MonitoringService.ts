import { QueueMetricsManager } from './metrics/queueMetrics';
import { MetricUpdateEvent } from '../types/metrics.types';
import { QueueAlert } from '../types/queue.types';
import { ErrorRecoveryManager } from '@/lib/error/ErrorRecoveryManager';

/**
 * Service central de monitoring
 * Gère la coordination entre les différents systèmes de métriques et d'alertes
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private queueMetrics = QueueMetricsManager.getInstance();
  private errorManager: ErrorRecoveryManager;
  private metricsListeners: Set<(event: MetricUpdateEvent) => void> = new Set();
  private alertListeners: Set<(alerts: QueueAlert[]) => void> = new Set();
  private activeAlerts: QueueAlert[] = [];

  private constructor() {
    this.errorManager = new ErrorRecoveryManager();
    this.initializeListeners();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeListeners(): void {
    // Écoute des métriques de queue
    this.queueMetrics.addListener('queue_high', this.handleMetricUpdate.bind(this));
    this.queueMetrics.addListener('queue_standard', this.handleMetricUpdate.bind(this));
    this.queueMetrics.addListener('queue_low', this.handleMetricUpdate.bind(this));

    // Gestion des erreurs systèmes
    window.addEventListener('taskRetry', ((event: CustomEvent) => {
      this.handleSystemEvent('retry', event.detail);
    }) as EventListener);

    window.addEventListener('taskFatalError', ((event: CustomEvent) => {
      this.handleSystemEvent('fatal', event.detail);
    }) as EventListener);
  }

  private handleMetricUpdate(event: MetricUpdateEvent): void {
    // Notifie les listeners des changements de métriques
    this.metricsListeners.forEach(listener => listener(event));

    // Vérifie si une alerte doit être émise
    if (event.newState.status === 'critical') {
      const alert: QueueAlert = {
        id: `${event.metricName}_${Date.now()}`,
        type: 'QUEUE_SIZE',
        priority: event.metricName.split('_')[1] as any,
        message: `Critical threshold exceeded for ${event.metricName}`,
        timestamp: new Date()
      };
      this.handleNewAlert(alert);
    }
  }

  private handleSystemEvent(type: 'retry' | 'fatal', detail: any): void {
    const alert: QueueAlert = {
      id: `${type}_${Date.now()}`,
      type: 'WAIT_TIME',
      priority: detail.priority || 'high',
      message: `System ${type} event: ${detail.message || 'No details'}`,
      timestamp: new Date()
    };
    this.handleNewAlert(alert);
  }

  private handleNewAlert(alert: QueueAlert): void {
    this.activeAlerts = [...this.activeAlerts, alert];
    this.notifyAlertListeners();

    // Auto-nettoyage après 5 minutes
    setTimeout(() => {
      this.activeAlerts = this.activeAlerts.filter(a => a.id !== alert.id);
      this.notifyAlertListeners();
    }, 5 * 60 * 1000);
  }

  // API Publique

  public onMetricsUpdate(listener: (event: MetricUpdateEvent) => void): () => void {
    this.metricsListeners.add(listener);
    return () => this.metricsListeners.delete(listener);
  }

  public onAlertsUpdate(listener: (alerts: QueueAlert[]) => void): () => void {
    this.alertListeners.add(listener);
    return () => this.alertListeners.delete(listener);
  }

  public updateQueueMetrics(sizes: Record<string, number>): void {
    Object.entries(sizes).forEach(([priority, size]) => {
      this.queueMetrics.updateQueueMetrics(priority as any, size);
    });
  }

  private notifyAlertListeners(): void {
    this.alertListeners.forEach(listener => listener([...this.activeAlerts]));
  }

  public getCurrentState() {
    return {
      metrics: this.queueMetrics.getAllQueueMetrics(),
      alerts: [...this.activeAlerts]
    };
  }
}