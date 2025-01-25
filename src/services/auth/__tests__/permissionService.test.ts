import { PermissionService } from '../permissionService';
import { EventSystem } from '../../../core/EventSystem';
import { PermissionLevel } from '../../../types';

jest.mock('../../../core/EventSystem');

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let eventSystem: jest.Mocked<EventSystem>;

  const mockResource = 'resource1';
  const mockUser = 'user1';
  const mockTeam = 'team1';

  beforeEach(() => {
    jest.clearAllMocks();
    permissionService = PermissionService.getInstance();
    eventSystem = EventSystem.getInstance() as jest.Mocked<EventSystem>;
  });

  describe('Basic Operations', () => {
    it('maintains singleton instance', () => {
      const instance1 = PermissionService.getInstance();
      const instance2 = PermissionService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('sets permission correctly', async () => {
      await permissionService.setPermission(mockResource, mockUser, PermissionLevel.READ, mockTeam);

      const hasPermission = await permissionService.checkPermission(
        mockResource,
        mockUser,
        PermissionLevel.READ
      );
      expect(hasPermission).toBe(true);
    });

    it('emits event on permission change', async () => {
      await permissionService.setPermission(mockResource, mockUser, PermissionLevel.WRITE, mockTeam);

      expect(eventSystem.emit).toHaveBeenCalledWith('permissionChanged', {
        resourceId: mockResource,
        userId: mockUser,
        teamId: mockTeam,
        granted: true,
        level: PermissionLevel.WRITE
      });
    });
  });

  describe('Permission Checks', () => {
    beforeEach(async () => {
      await permissionService.setPermission(mockResource, mockUser, PermissionLevel.WRITE);
    });

    it('allows access at same level', async () => {
      const hasPermission = await permissionService.checkPermission(
        mockResource,
        mockUser,
        PermissionLevel.WRITE
      );
      expect(hasPermission).toBe(true);
    });

    it('allows access at lower level', async () => {
      const hasPermission = await permissionService.checkPermission(
        mockResource,
        mockUser,
        PermissionLevel.READ
      );
      expect(hasPermission).toBe(true);
    });

    it('denies access at higher level', async () => {
      const hasPermission = await permissionService.checkPermission(
        mockResource,
        mockUser,
        PermissionLevel.ADMIN
      );
      expect(hasPermission).toBe(false);
    });

    it('denies access for non-existent permission', async () => {
      const hasPermission = await permissionService.checkPermission(
        'nonexistent',
        mockUser,
        PermissionLevel.READ
      );
      expect(hasPermission).toBe(false);
    });
  });

  describe('Permission Management', () => {
    beforeEach(async () => {
      await permissionService.setPermission(mockResource, mockUser, PermissionLevel.WRITE, mockTeam);
    });

    it('revokes access correctly', async () => {
      await permissionService.revokeAccess(mockResource, mockUser);

      const hasPermission = await permissionService.checkPermission(
        mockResource,
        mockUser,
        PermissionLevel.WRITE
      );
      expect(hasPermission).toBe(false);
      expect(eventSystem.emit).toHaveBeenCalledWith('permissionChanged', {
        resourceId: mockResource,
        userId: mockUser,
        teamId: mockTeam,
        granted: false,
        level: PermissionLevel.NONE
      });
    });

    it('gets all permissions for resource', async () => {
      const permissions = await permissionService.getPermissions(mockResource);
      expect(permissions).toHaveLength(1);
      expect(permissions[0]).toEqual({
        userId: mockUser,
        resourceId: mockResource,
        level: PermissionLevel.WRITE,
        teamId: mockTeam
      });
    });

    it('gets all permissions for user', async () => {
      const permissions = await permissionService.getUserPermissions(mockUser);
      expect(permissions).toHaveLength(1);
      expect(permissions[0]).toEqual({
        userId: mockUser,
        resourceId: mockResource,
        level: PermissionLevel.WRITE,
        teamId: mockTeam
      });
    });
  });
});