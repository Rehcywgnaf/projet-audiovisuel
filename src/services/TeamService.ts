import { NotificationService } from './NotificationService';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: number;
  currentProjects: string[];
  nextAvailable: Date;
}

export class TeamService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async getTeamAvailability(): Promise<TeamMember[]> {
    try {
      const response = await fetch('/api/team/availability');
      if (!response.ok) throw new Error('Erreur lors de la récupération des données équipe');
      return await response.json();
    } catch (error) {
      console.error('Erreur TeamService:', error);
      throw error;
    }
  }

  async updateMemberStatus(memberId: string, status: string): Promise<void> {
    try {
      const response = await fetch(`/api/team/member/${memberId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');
      await this.notifyTeamChanges(memberId, { type: 'status_update', status });
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      throw error;
    }
  }

  async notifyTeamChanges(teamId: string, changes: any): Promise<void> {
    await this.notificationService.notify({
      target: `team_${teamId}`,
      type: 'team_update',
      data: changes
    });
  }
}