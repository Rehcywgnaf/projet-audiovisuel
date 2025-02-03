import { MonitoringDashboard } from '@/components/monitoring/dashboard/MonitoringDashboard';

export const metadata = {
  title: 'Vue Générale du Monitoring - SAPAV',
  description: 'Tableau de bord général du monitoring SAPAV'
};

export default function MonitoringOverviewPage() {
  return <MonitoringDashboard />;
}