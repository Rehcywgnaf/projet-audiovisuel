import ProjectSummary from '@/components/ProjectSummary';

export default function ProjectPage({ params }: { params: { id: string } }) {
  // Temporary mock data until Supabase integration
  const projectData = {
    title: 'Documentary Series 2024',
    organization: 'MediaProd Inc.',
    budget: 150000,
    team: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    timeline: {
      start: '2024-01-15',
      end: '2024-06-30',
      milestones: [
        { date: '2024-02-15', description: 'Pre-production complete' },
        { date: '2024-04-30', description: 'Principal photography' },
        { date: '2024-06-15', description: 'Post-production' },
      ],
    },
    requirements: [
      'Full HD video production',
      'Original soundtrack',
      'Motion graphics package',
      'Color grading',
    ],
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <ProjectSummary project={projectData} />
    </div>
  );
}