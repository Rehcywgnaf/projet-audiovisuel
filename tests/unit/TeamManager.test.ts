import { TeamManager } from '../../src/components/Teams/TeamManager';
import { EventSystem } from '../../src/core/EventSystem';

describe('TeamManager', () => {
    let teamManager: TeamManager;
    let eventSystem: EventSystem;

    beforeEach(() => {
        teamManager = TeamManager.getInstance();
        eventSystem = EventSystem.getInstance();
    });

    test('doit mettre à jour un rôle et émettre un événement', () => {
        const mockEventEmit = jest.spyOn(eventSystem, 'emit');
        
        teamManager.updateRole('team1', 'user1', 'admin');
        
        // Vérifie que le rôle est mis à jour
        expect(teamManager.getRole('team1', 'user1')).toBe('admin');
        
        // Vérifie que l'événement a été émis
        expect(mockEventEmit).toHaveBeenCalledWith('roleChanged', {
            teamId: 'team1',
            userId: 'user1',
            role: 'admin'
        });
    });

    test('doit gérer les permissions révoquées', () => {
        const mockConsoleLog = jest.spyOn(console, 'log');
        
        // Simule un événement de permission révoquée
        teamManager.initPermissionListener();
        eventSystem.emit('permissionChanged', {
            userId: 'user1',
            teamId: 'team1',
            granted: false
        });

        expect(mockConsoleLog).toHaveBeenCalledWith(
            expect.stringContaining('Permission révoquée')
        );
    });

    test('doit retourner null pour un utilisateur inexistant', () => {
        expect(teamManager.getRole('team1', 'nonexistent')).toBeNull();
    });

    test('doit gérer la mise à jour d\'un rôle existant', () => {
        teamManager.updateRole('team1', 'user1', 'editor');
        teamManager.updateRole('team1', 'user1', 'admin');
        
        expect(teamManager.getRole('team1', 'user1')).toBe('admin');
    });

    test('doit correctement initialiser les listeners', () => {
        const mockOn = jest.spyOn(eventSystem, 'on');
        
        teamManager.initPermissionListener();
        
        expect(mockOn).toHaveBeenCalledWith(
            'permissionChanged',
            expect.any(Function)
        );
    });
});