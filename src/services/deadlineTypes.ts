// Types centralisés pour les deadlines

export interface Deadline {
  id: string;
  projectName: string;
  description: string;
  date: string;
  daysLeft: number;
  team: string;
  priority: 'low' | 'medium' | 'high';
  source?: 'RSS' | 'Manual' | 'AI';
  aiEnriched?: boolean;
  history?: DeadlineHistoryEntry[];
}

export interface DeadlineHistoryEntry {
  type: 'creation' | 'modification' | 'ai_suggestion';
  date: string;
  details: string;
  changes?: Record<string, { old: any; new: any }>;
}

export interface DeadlineFilter {
  search?: string;
  type?: string;
  dateMin?: string;
  dateMax?: string;
  priority?: 'low' | 'medium' | 'high';
}
