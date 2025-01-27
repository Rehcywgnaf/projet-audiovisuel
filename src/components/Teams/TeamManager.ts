import { TeamState, TeamAction, Team, TeamMember } from './types';

export class TeamManager {
  private state: TeamState = {
    teams: [],
    loading: false,
    error: null
  };

  private listeners: ((state: TeamState) => void)[] = [];

  private async updateState(action: TeamAction) {
    switch (action.type) {
      case 'SET_TEAMS':
        this.state = { ...this.state, teams: action.payload, loading: false };
        break;
      case 'ADD_MEMBER':
        const updatedTeams = this.state.teams.map(team => 
          team.id === action.payload.teamId
            ? { ...team, members: [...team.members, action.payload.member] }
            : team
        );
        this.state = { ...this.state, teams: updatedTeams };
        break;
      case 'UPDATE_AVAILABILITY':
        const teamsWithUpdatedMember = this.state.teams.map(team => ({
          ...team,
          members: team.members.map(member =>
            member.id === action.payload.memberId
              ? { ...member, availability: action.payload.availability }
              : member
          )
        }));
        this.state = { ...this.state, teams: teamsWithUpdatedMember };
        break;
      case 'SET_ERROR':
        this.state = { ...this.state, error: action.payload, loading: false };
        break;
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: (state: TeamState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async fetchTeams() {
    try {
      const response = await fetch('/api/teams');
      const teams = await response.json();
      await this.updateState({ type: 'SET_TEAMS', payload: teams });
    } catch (error) {
      await this.updateState({ type: 'SET_ERROR', payload: error.message });
    }
  }

  public async addMember(teamId: string, member: TeamMember) {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        body: JSON.stringify(member)
      });
      if (!response.ok) throw new Error('Failed to add member');
      await this.updateState({ 
        type: 'ADD_MEMBER', 
        payload: { teamId, member } 
      });
    } catch (error) {
      await this.updateState({ type: 'SET_ERROR', payload: error.message });
    }
  }

  public async updateMemberAvailability(memberId: string, availability: number) {
    try {
      const response = await fetch(`/api/members/${memberId}/availability`, {
        method: 'PATCH',
        body: JSON.stringify({ availability })
      });
      if (!response.ok) throw new Error('Failed to update availability');
      await this.updateState({
        type: 'UPDATE_AVAILABILITY',
        payload: { memberId, availability }
      });
    } catch (error) {
      await this.updateState({ type: 'SET_ERROR', payload: error.message });
    }
  }

  public getTeamById(teamId: string): Team | undefined {
    return this.state.teams.find(team => team.id === teamId);
  }

  public getMemberById(memberId: string): TeamMember | undefined {
    let foundMember: TeamMember | undefined;
    this.state.teams.some(team => {
      foundMember = team.members.find(member => member.id === memberId);
      return !!foundMember;
    });
    return foundMember;
  }
}