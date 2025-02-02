import { BaseMetricsManager } from './baseMetrics';
import { MetricState, MetricConfig, MetricDataPoint } from '../../types/metrics.types';

class MetricArchive {
  private hourlyData: MetricDataPoint[] = [];
  private dailyData: MetricDataPoint[] = [];
  private weeklyData: MetricDataPoint[] = [];
  
  addDataPoint(point: MetricDataPoint) {
    const now = Date.now();
    this.hourlyData.push(point);
    
    // Agrégation horaire vers journalier
    if (this.hourlyData.length > 60) {
      const hourlyAverage = this.aggregate(this.hourlyData);
      this.dailyData.push(hourlyAverage);
      this.hourlyData = this.hourlyData.slice(-60); // Garde la dernière heure
    }
    
    // Agrégation journalière vers hebdomadaire
    if (this.dailyData.length > 24) {
      const dailyAverage = this.aggregate(this.dailyData);
      this.weeklyData.push(dailyAverage);
      this.dailyData = this.dailyData.slice(-24); // Garde le dernier jour
    }
    
    // Limite les données hebdomadaires à 7 jours
    this.weeklyData = this.weeklyData.slice(-7);
  }
  
  private aggregate(points: MetricDataPoint[]): MetricDataPoint {
    const total = points.reduce((sum, point) => sum + point.value, 0);
    return {
      timestamp: new Date().toISOString(),
      value: total / points.length
    };
  }
  
  getData(period: 'hour' | 'day' | 'week'): MetricDataPoint[] {
    switch (period) {
      case 'hour':
        return [...this.hourlyData];
      case 'day':
        return [...this.dailyData];
      case 'week':
        return [...this.weeklyData];
    }
  }
}

export class LongTermMetricsManager extends BaseMetricsManager {
  private static instance: LongTermMetricsManager;
  private archives: Map<string, MetricArchive> = new Map();
  
  private constructor() {
    super();
  }
  
  static getInstance(): LongTermMetricsManager {
    if (!LongTermMetricsManager.instance) {
      LongTermMetricsManager.instance = new LongTermMetricsManager();
    }
    return LongTermMetricsManager.instance;
  }
  
  protected override registerMetric(config: MetricConfig): void {
    super.registerMetric(config);
    this.archives.set(config.name, new MetricArchive());
  }
  
  protected override updateMetric(name: string, value: number): void {
    super.updateMetric(name, value);
    
    const archive = this.archives.get(name);
    if (archive) {
      archive.addDataPoint({
        timestamp: new Date().toISOString(),
        value
      });
    }
  }
  
  public getHistoricalData(metricName: string, period: 'hour' | 'day' | 'week'): MetricDataPoint[] {
    const archive = this.archives.get(metricName);
    if (!archive) return [];
    return archive.getData(period);
  }
  
  public getMetricTrends(metricName: string): {
    current: number;
    hourlyAverage: number;
    dailyAverage: number;
    weeklyAverage: number;
  } {
    const archive = this.archives.get(metricName);
    if (!archive) {
      return {
        current: 0,
        hourlyAverage: 0,
        dailyAverage: 0,
        weeklyAverage: 0
      };
    }
    
    const hourlyData = archive.getData('hour');
    const dailyData = archive.getData('day');
    const weeklyData = archive.getData('week');
    
    return {
      current: hourlyData[hourlyData.length - 1]?.value || 0,
      hourlyAverage: this.calculateAverage(hourlyData),
      dailyAverage: this.calculateAverage(dailyData),
      weeklyAverage: this.calculateAverage(weeklyData)
    };
  }
  
  private calculateAverage(points: MetricDataPoint[]): number {
    if (points.length === 0) return 0;
    const sum = points.reduce((acc, point) => acc + point.value, 0);
    return sum / points.length;
  }
}