import TeamDashboard from '@/components/TeamTracking';
import FeedbackSystem from '@/components/FeedbackSystem';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <TeamDashboard />
      <div className="h-8" />
      <FeedbackSystem />
    </main>
  );
}