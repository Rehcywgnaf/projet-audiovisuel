export interface AOSubmission {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  budget: number;
  requirements: string[];
  status: 'draft' | 'in_progress' | 'submitted' | 'won' | 'lost';
  documents: {
    technical: string[];
    commercial: string[];
    administrative: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}