export interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: number;
  currentProjects: string[];
  nextAvailable: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  projects: string[];
}

export interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

export type TeamAction = 
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'ADD_MEMBER'; payload: { teamId: string; member: TeamMember } }
  | { type: 'UPDATE_AVAILABILITY'; payload: { memberId: string; availability: number } }
  | { type: 'SET_ERROR'; payload: string };