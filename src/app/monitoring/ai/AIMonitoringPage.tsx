import { AIPerformanceView } from '@/monitoring/components/dashboard/AIPerformanceView';

export const metadata = {
  title: 'Performance IA - SAPAV',
  description: 'Monitoring des performances de l\'IA SAPAV'
};

export default function AIMonitoringPage() {
  return <AIPerformanceView />;
}