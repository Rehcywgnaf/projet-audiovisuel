import { EventSystem } from '../../core/EventSystem';
import { TeamRole, TeamMember } from './types';

export class TeamManager {
    private static instance: TeamManager;
    private eventSystem: EventSystem;
    private teams: Map<string, TeamMember[]>;

    private constructor() {
        this.eventSystem = EventSystem.getInstance();
        this.teams = new Map();
    }

    static getInstance(): TeamManager {
        if (!TeamManager.instance) {
            TeamManager.instance = new TeamManager();
        }
        return TeamManager.instance;
    }

    updateRole(teamId: string, userId: string, role: TeamRole) {
        let team = this.teams.get(teamId) ?? [];
        const memberIndex = team.findIndex(m => m.userId === userId);
        
        if (memberIndex > -1) {
            team[memberIndex].role = role;
        } else {
            team.push({ userId, teamId, role });
        }
        
        this.teams.set(teamId, team);
        
        // Émettre l'événement roleChanged
        this.eventSystem.emit('roleChanged', { teamId, userId, role });
    }

    getRole(teamId: string, userId: string): TeamRole | null {
        const team = this.teams.get(teamId);
        const member = team?.find(m => m.userId === userId);
        return member?.role ?? null;
    }

    // Réception des événements de permissions
    initPermissionListener() {
        this.eventSystem.on('permissionChanged', (data) => {
            const { userId, teamId, granted } = data;
            // Mise à jour du statut de l'équipe si nécessaire
            if (!granted && this.getRole(teamId, userId)) {
                // Notification à l'interface utilisateur
                console.log(`Permission révoquée pour ${userId} dans l'équipe ${teamId}`);
            }
        });
    }
}