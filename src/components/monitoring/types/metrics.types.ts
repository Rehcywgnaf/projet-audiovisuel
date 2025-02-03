export interface MetricDataPoint {
  timestamp: number;
  value: number;
}

export type TimeRange = 'hour' | 'day' | 'week';

export interface MetricTrends {
  current: number;
  hourlyAverage: number;
  dailyAverage: number;
  weeklyAverage: number;
}

export interface MetricsManager {
  getHistoricalData(metricName: string, timeRange: TimeRange): MetricDataPoint[];
  getMetricTrends(metricName: string): MetricTrends;
  recordMetric(metricName: string, value: number): void;
}