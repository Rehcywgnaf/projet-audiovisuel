import { ProjectMetricsView } from '@/monitoring/components/dashboard/ProjectMetricsView';

export const metadata = {
  title: 'Monitoring des Projets - SAPAV',
  description: 'Suivi et métriques des projets SAPAV'
};

export default function ProjectsMonitoringPage() {
  return <ProjectMetricsView />;
}