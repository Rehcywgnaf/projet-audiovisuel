import { NotificationService } from './NotificationService';

export class TeamService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async getTeamAvailability() {
    // Implémentation
  }

  async updateMemberStatus(memberId: string, status: string) {
    // Implémentation
  }

  async notifyTeamChanges(teamId: string, changes: any) {
    // Implémentation
  }
}