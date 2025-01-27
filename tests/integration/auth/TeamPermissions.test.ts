import { PermissionService } from '../../../src/services/auth/permissionService';
import { TeamManager } from '../../../src/components/Teams/TeamManager';
import { EventSystem } from '../../../src/core/EventSystem';
import { PermissionLevel } from '../../../src/types';

describe('Intégration Teams-Permissions', () => {
    let permissionService: PermissionService;
    let teamManager: TeamManager;
    let eventSystem: EventSystem;

    beforeEach(() => {
        teamManager = TeamManager.getInstance();
        permissionService = PermissionService.getInstance();
        eventSystem = EventSystem.getInstance();
    });

    test('changement de rôle doit déclencher mise à jour des permissions', (done) => {
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';

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

        permissionService.setPermission(resourceId, userId, PermissionLevel.READ, teamId);
        teamManager.updateRole(teamId, userId, 'admin');
    });

    test('révocation d\'accès en cascade', async () => {
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';

        teamManager.updateRole(teamId, userId, 'admin');
        await permissionService.setPermission(resourceId, userId, PermissionLevel.WRITE, teamId);

        teamManager.updateRole(teamId, userId, null);

        const hasAccess = await permissionService.checkPermission(
            resourceId,
            userId,
            PermissionLevel.WRITE
        );
        expect(hasAccess).toBe(false);
    });

    test('changement de rôle doit respecter les niveaux de permission', async () => {
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';

        teamManager.updateRole(teamId, userId, 'editor');
        
        const canWrite = await permissionService.checkPermission(
            resourceId,
            userId,
            PermissionLevel.WRITE
        );
        const canAdmin = await permissionService.checkPermission(
            resourceId,
            userId,
            PermissionLevel.ADMIN
        );

        expect(canWrite).toBe(true);
        expect(canAdmin).toBe(false);
    });

    test('gestion des modifications simultanées', (done) => {
        const resourceId = 'doc1';
        const userId = 'user1';
        const teamId = 'team1';
        
        let eventCount = 0;
        const expectedEvents = 2;

        eventSystem.on('permissionChanged', () => {
            eventCount++;
            if (eventCount === expectedEvents) {
                done();
            }
        });

        Promise.all([
            permissionService.setPermission(resourceId, userId, PermissionLevel.WRITE, teamId),
            teamManager.updateRole(teamId, userId, 'admin')
        ]);
    });
});