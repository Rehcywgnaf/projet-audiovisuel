import {
  MetricConfig,
  MetricDataPoint,
  MetricState,
  MetricStatus,
  MetricListener,
  MetricUpdateEvent
} from '../../types/metrics.types';

/**
 * Gestionnaire de base pour les métriques
 * Responsable de la collecte, du stockage et de la gestion des métriques
 */
export class BaseMetricsManager {
  private metrics: Map<string, MetricState> = new Map();
  private configs: Map<string, MetricConfig> = new Map();
  private listeners: Map<string, Set<MetricListener>> = new Map();

  /**
   * Configure une nouvelle métrique
   */
  protected registerMetric(config: MetricConfig): void {
    if (this.configs.has(config.name)) {
      throw new Error(`Metric ${config.name} already registered`);
    }

    this.configs.set(config.name, config);
    this.metrics.set(config.name, {
      dataPoints: [],
      currentValue: 0,
      status: 'healthy',
      lastUpdate: new Date().toISOString()
    });
    this.listeners.set(config.name, new Set());
  }

  /**
   * Met à jour la valeur d'une métrique
   */
  protected updateMetric(name: string, value: number): void {
    const config = this.configs.get(name);
    if (!config) {
      throw new Error(`Metric ${name} not registered`);
    }

    const oldState = this.metrics.get(name)!;
    const newState = this.calculateNewState(config, value, oldState);
    
    this.metrics.set(name, newState);
    this.notifyListeners(name, oldState, newState);
  }

  /**
   * Calcule le nouvel état d'une métrique
   */
  private calculateNewState(
    config: MetricConfig,
    value: number,
    oldState: MetricState
  ): MetricState {
    const now = new Date().toISOString();
    const newDataPoint: MetricDataPoint = { timestamp: now, value };
    
    // Filtre les points de données selon la rétention configurée
    const maxAge = new Date(Date.now() - config.retention.maxAgeMinutes * 60000);
    const filteredDataPoints = oldState.dataPoints
      .filter(point => new Date(point.timestamp) > maxAge)
      .slice(-(config.retention.maxDataPoints - 1));

    return {
      dataPoints: [...filteredDataPoints, newDataPoint],
      currentValue: value,
      status: this.calculateStatus(value, config.thresholds),
      lastUpdate: now
    };
  }

  /**
   * Détermine le statut d'une métrique selon ses seuils
   */
  private calculateStatus(value: number, thresholds: MetricConfig['thresholds']): MetricStatus {
    if (value >= thresholds.critical) return 'critical';
    if (value >= thresholds.warning) return 'warning';
    return 'healthy';
  }

  /**
   * Ajoute un listener pour une métrique spécifique
   */
  public addListener(metricName: string, listener: MetricListener): () => void {
    const metricListeners = this.listeners.get(metricName);
    if (!metricListeners) {
      throw new Error(`Metric ${metricName} not registered`);
    }

    metricListeners.add(listener);
    return () => metricListeners.delete(listener);
  }

  /**
   * Notifie les listeners d'une métrique
   */
  private notifyListeners(
    metricName: string,
    oldState: MetricState,
    newState: MetricState
  ): void {
    const metricListeners = this.listeners.get(metricName);
    if (!metricListeners) return;

    const event: MetricUpdateEvent = {
      metricName,
      oldState,
      newState
    };

    metricListeners.forEach(listener => listener(event));
  }

  /**
   * Récupère l'état actuel d'une métrique
   */
  public getMetricState(name: string): MetricState | null {
    return this.metrics.get(name) || null;
  }

  /**
   * Récupère la configuration d'une métrique
   */
  public getMetricConfig(name: string): MetricConfig | null {
    return this.configs.get(name) || null;
  }
}