import { TeamManager } from '../../src/components/Teams/TeamManager';
import { DrivePerms } from '../../src/components/Drive/DrivePerms';
import { EventSystem } from '../../src/core/EventSystem';
import { PermissionLevel } from '../../src/types';

describe('Intégration Teams-DrivePerms', () => {
    let teamManager: TeamManager;
    let drivePerms: DrivePerms;
    let eventSystem: EventSystem;

    beforeEach(() => {
        teamManager = TeamManager.getInstance();
        drivePerms = DrivePerms.getInstance();
        eventSystem = EventSystem.getInstance();
    });

    test('changement de rôle doit déclencher mise à jour des permissions', (done) => {
        // Configuration initiale
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';

        // Écoute de l'événement permissionChanged
        eventSystem.on('permissionChanged', (data) => {
            expect(data).toEqual(expect.objectContaining({
                resourceId,
                userId,
                teamId,
                granted: true,
                level: PermissionLevel.ADMIN
            }));
            done();
        });

        // Attribution des permissions initiales
        drivePerms.setPermission(resourceId, userId, PermissionLevel.READ, teamId);
        
        // Changement de rôle qui devrait déclencher une mise à jour des permissions
        teamManager.updateRole(teamId, userId, 'admin');
    });

    test('révocation d\'accès en cascade', async () => {
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';

        // Setup initial
        teamManager.updateRole(teamId, userId, 'admin');
        drivePerms.setPermission(resourceId, userId, PermissionLevel.WRITE, teamId);

        // Révocation du rôle
        teamManager.updateRole(teamId, userId, null);

        // Vérification que les permissions ont été révoquées
        const hasAccess = await drivePerms.checkPermission(resourceId, userId, PermissionLevel.WRITE);
        expect(hasAccess).toBe(false);
    });

    test('changement de rôle doit respecter les niveaux de permission', async () => {
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';

        // Attribution d'un rôle d'éditeur
        teamManager.updateRole(teamId, userId, 'editor');
        
        // Vérification des permissions accordées
        const canWrite = await drivePerms.checkPermission(resourceId, userId, PermissionLevel.WRITE);
        const canAdmin = await drivePerms.checkPermission(resourceId, userId, PermissionLevel.ADMIN);

        expect(canWrite).toBe(true);
        expect(canAdmin).toBe(false);
    });

    test('doit gérer les modifications simultanées', (done) => {
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';
        
        let eventCount = 0;
        const expectedEvents = 2; // On attend 2 événements

        eventSystem.on('permissionChanged', () => {
            eventCount++;
            if (eventCount === expectedEvents) {
                done();
            }
        });

        // Modifications simultanées
        Promise.all([
            drivePerms.setPermission(resourceId, userId, PermissionLevel.WRITE, teamId),
            teamManager.updateRole(teamId, userId, 'admin')
        ]);
    });
});