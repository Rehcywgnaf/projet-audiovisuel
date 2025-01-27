import { QueueMonitor } from '../monitoring/QueueMonitor';
import { ErrorRecoveryManager } from '../error/ErrorRecoveryManager';
import { QueueAlert } from '@/types';

class MonitoringService {
  private static instance: MonitoringService;
  private queueMonitor: QueueMonitor;
  private errorManager: ErrorRecoveryManager;
  private metricsListeners: ((metrics: any) => void)[] = [];
  private alertListeners: ((alerts: QueueAlert[]) => void)[] = [];
  private errorHistoryListeners: ((history: any[]) => void)[] = [];
  private activeAlerts: QueueAlert[] = [];
  private errorHistory: any[] = [];

  private constructor() {
    this.queueMonitor = new QueueMonitor();
    this.errorManager = new ErrorRecoveryManager();
    this.initializeListeners();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeListeners() {
    this.queueMonitor.onAlert((alert) => {
      this.handleNewAlert(alert);
    });

    window.addEventListener('taskRetry', ((event: CustomEvent) => {
      this.handleRetryEvent(event.detail);
    }) as EventListener);

    window.addEventListener('taskFatalError', ((event: CustomEvent) => {
      this.handleFatalError(event.detail);
    }) as EventListener);
  }

  private handleNewAlert(alert: QueueAlert) {
    this.activeAlerts = [...this.activeAlerts, alert];
    this.notifyAlertListeners();

    setTimeout(() => {
      this.activeAlerts = this.activeAlerts.filter(a => a !== alert);
      this.notifyAlertListeners();
    }, 5 * 60 * 1000);
  }

  private handleRetryEvent(detail: any) {
    const historyEntry = {
      ...detail,
      timestamp: new Date(),
      status: 'retry'
    };
    this.errorHistory = [historyEntry, ...this.errorHistory].slice(0, 50);
    this.notifyErrorHistoryListeners();
  }

  private handleFatalError(detail: any) {
    const historyEntry = {
      ...detail,
      timestamp: new Date(),
      status: 'fatal'
    };
    this.errorHistory = [historyEntry, ...this.errorHistory].slice(0, 50);
    this.notifyErrorHistoryListeners();
  }

  onMetricsUpdate(listener: (metrics: any) => void) {
    this.metricsListeners.push(listener);
    return () => {
      this.metricsListeners = this.metricsListeners.filter(l => l !== listener);
    };
  }

  onAlertsUpdate(listener: (alerts: QueueAlert[]) => void) {
    this.alertListeners.push(listener);
    return () => {
      this.alertListeners = this.alertListeners.filter(l => l !== listener);
    };
  }

  onErrorHistoryUpdate(listener: (history: any[]) => void) {
    this.errorHistoryListeners.push(listener);
    return () => {
      this.errorHistoryListeners = this.errorHistoryListeners.filter(l => l !== listener);
    };
  }

  private notifyMetricsListeners() {
    const metrics = this.queueMonitor.getMetrics();
    this.metricsListeners.forEach(listener => listener(metrics));
  }

  private notifyAlertListeners() {
    this.alertListeners.forEach(listener => listener(this.activeAlerts));
  }

  private notifyErrorHistoryListeners() {
    this.errorHistoryListeners.forEach(listener => listener(this.errorHistory));
  }

  updateMetrics(queueSizes: any, oldestTasks: any) {
    this.queueMonitor.updateMetrics(queueSizes, oldestTasks);
    this.notifyMetricsListeners();
  }

  getCurrentState() {
    return {
      metrics: this.queueMonitor.getMetrics(),
      alerts: this.activeAlerts,
      errorHistory: this.errorHistory
    };
  }
}

export const monitoringService = MonitoringService.getInstance();