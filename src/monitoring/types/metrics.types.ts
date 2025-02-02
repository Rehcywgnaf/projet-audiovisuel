/**
 * Représente un point de donnée métrique avec son timestamp
 */
export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

/**
 * Statut possible pour une métrique
 */
export type MetricStatus = 'healthy' | 'warning' | 'critical';

/**
 * Configuration des seuils pour une métrique
 */
export interface MetricThresholds {
  warning: number;
  critical: number;
}

/**
 * Configuration pour une métrique
 */
export interface MetricConfig {
  name: string;
  thresholds: MetricThresholds;
  retention: {
    maxDataPoints: number;
    maxAgeMinutes: number;
  };
}

/**
 * État d'une métrique
 */
export interface MetricState {
  dataPoints: MetricDataPoint[];
  currentValue: number;
  status: MetricStatus;
  lastUpdate: string;
}

/**
 * Événement de mise à jour de métrique
 */
export interface MetricUpdateEvent {
  metricName: string;
  oldState: MetricState;
  newState: MetricState;
}

/**
 * Interface pour les listeners de métriques
 */
export type MetricListener = (event: MetricUpdateEvent) => void;

/**
 * Configuration du cache de métriques
 */
export interface MetricsCacheConfig {
  retention: number; // minutes
  cleanupInterval: number; // minutes
}