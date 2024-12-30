import Dashboard from '@/components/Dashboard';

// Temporary mock data until Supabase integration
const mockProjects = [
  {
    id: '1',
    title: 'Documentary Series 2024',
    organization: 'MediaProd Inc.',
    status: 'active',
    updatedAt: '2024-12-30',
  },
  {
    id: '2',
    title: 'Short Film Collection',
    organization: 'Creative Films',
    status: 'pending',
    updatedAt: '2024-12-29',
  },
] as const;

const mockStats = {
  totalProjects: 10,
  activeProjects: 4,
  completedProjects: 5,
};

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>
      <Dashboard projects={mockProjects} stats={mockStats} />
    </main>
  );
}