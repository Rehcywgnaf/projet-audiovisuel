import type { MetricDataPoint, TimeRange, MetricTrends, MetricsManager } from '../../types/metrics.types';

class LongTermMetrics implements MetricsManager {
  private metrics: Map<string, MetricDataPoint[]>;
  private readonly MAX_POINTS = 1000;

  constructor() {
    this.metrics = new Map();
  }

  recordMetric(metricName: string, value: number): void {
    const timestamp = Date.now();
    const dataPoint: MetricDataPoint = { timestamp, value };

    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }

    const metricData = this.metrics.get(metricName)!;
    metricData.push(dataPoint);

    // Garder uniquement les MAX_POINTS plus récents points
    if (metricData.length > this.MAX_POINTS) {
      metricData.shift();
    }

    this.metrics.set(metricName, metricData);
  }

  getHistoricalData(metricName: string, timeRange: TimeRange): MetricDataPoint[] {
    const metricData = this.metrics.get(metricName) || [];
    const now = Date.now();
    let threshold: number;

    switch (timeRange) {
      case 'hour':
        threshold = now - 60 * 60 * 1000;
        break;
      case 'day':
        threshold = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        threshold = now - 7 * 24 * 60 * 60 * 1000;
        break;
    }

    return metricData.filter(point => point.timestamp >= threshold);
  }

  getMetricTrends(metricName: string): MetricTrends {
    const hourData = this.getHistoricalData(metricName, 'hour');
    const dayData = this.getHistoricalData(metricName, 'day');
    const weekData = this.getHistoricalData(metricName, 'week');

    return {
      current: hourData[hourData.length - 1]?.value || 0,
      hourlyAverage: this.calculateAverage(hourData),
      dailyAverage: this.calculateAverage(dayData),
      weeklyAverage: this.calculateAverage(weekData)
    };
  }

  private calculateAverage(data: MetricDataPoint[]): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, point) => acc + point.value, 0);
    return sum / data.length;
  }
}

export const longTermMetrics = new LongTermMetrics();