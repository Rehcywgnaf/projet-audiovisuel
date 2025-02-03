export interface MetricsData {
  validation: {
    avgTime: number;
    threshold: number;
    history: Array<{
      time: number;
      value: number;
    }>;
  };
  cache: {
    rssHitRate: number;
    aiEditorHitRate: number;
    docValidationHitRate: number;
    templatesHitRate: number;
  };
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
}

export interface ChartComponentProps {
  data: Array<{
    time: number;
    value: number;
  }>;
  avgTime: number;
}

export interface CacheMetricProps {
  components: Array<{
    name: string;
    rate: number;
    target: number;
    duration: string;
  }>;
}