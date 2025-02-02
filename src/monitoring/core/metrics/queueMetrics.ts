import { BaseMetricsManager } from './baseMetrics';
import { MetricConfig } from '../../types/metrics.types';

type QueuePriority = 'high' | 'standard' | 'low';

interface QueueMetricConfig extends MetricConfig {
  priority: QueuePriority;
}

/**
 * Gestionnaire spécialisé pour les métriques de queue
 */
export class QueueMetricsManager extends BaseMetricsManager {
  private static instance: QueueMetricsManager;
  
  // Configuration par défaut des métriques de queue
  private readonly defaultQueueConfigs: Record<QueuePriority, QueueMetricConfig> = {
    high: {
      name: 'queue_high',
      priority: 'high',
      thresholds: {
        warning: 10,
        critical: 20
      },
      retention: {
        maxDataPoints: 100,
        maxAgeMinutes: 60
      }
    },
    standard: {
      name: 'queue_standard',
      priority: 'standard',
      thresholds: {
        warning: 20,
        critical: 40
      },
      retention: {
        maxDataPoints: 100,
        maxAgeMinutes: 60
      }
    },
    low: {
      name: 'queue_low',
      priority: 'low',
      thresholds: {
        warning: 30,
        critical: 60
      },
      retention: {
        maxDataPoints: 100,
        maxAgeMinutes: 60
      }
    }
  };

  private constructor() {
    super();
    // Enregistrement des métriques de base pour chaque priorité
    Object.values(this.defaultQueueConfigs).forEach(config => {
      this.registerMetric(config);
    });
  }

  public static getInstance(): QueueMetricsManager {
    if (!QueueMetricsManager.instance) {
      QueueMetricsManager.instance = new QueueMetricsManager();
    }
    return QueueMetricsManager.instance;
  }

  /**
   * Met à jour les métriques pour une queue spécifique
   */
  public updateQueueMetrics(priority: QueuePriority, size: number): void {
    const metricName = `queue_${priority}`;
    this.updateMetric(metricName, size);
  }

  /**
   * Met à jour les métriques pour toutes les queues
   */
  public updateAllQueueMetrics(sizes: Record<QueuePriority, number>): void {
    Object.entries(sizes).forEach(([priority, size]) => {
      this.updateQueueMetrics(priority as QueuePriority, size);
    });
  }

  /**
   * Récupère les métriques actuelles pour toutes les queues
   */
  public getAllQueueMetrics() {
    return Object.keys(this.defaultQueueConfigs).reduce((acc, priority) => {
      const metricName = `queue_${priority}`;
      return {
        ...acc,
        [priority]: this.getMetricState(metricName)
      };
    }, {} as Record<string, any>);
  }

  /**
   * Met à jour la configuration d'une queue spécifique
   */
  public updateQueueConfig(priority: QueuePriority, config: Partial<QueueMetricConfig>): void {
    const currentConfig = this.defaultQueueConfigs[priority];
    const newConfig = {
      ...currentConfig,
      ...config,
      name: currentConfig.name, // Le nom ne peut pas être modifié
      priority: currentConfig.priority // La priorité ne peut pas être modifiée
    };

    this.defaultQueueConfigs[priority] = newConfig;
    // Ré-enregistre la métrique avec la nouvelle configuration
    this.registerMetric(newConfig);
  }
}