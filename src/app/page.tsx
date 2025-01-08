import TeamTracking from '@/components/TeamTracking';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SAPAV - Test</h1>
      <div className="mt-8">
        <TeamTracking />
      </div>
    </div>
  );
}