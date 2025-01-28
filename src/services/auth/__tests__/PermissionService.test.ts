import { PermissionService } from '../PermissionService';
import { AuthService } from '../AuthService';

jest.mock('../AuthService');

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    permissionService = new PermissionService();
    mockFetch = jest.spyOn(global, 'fetch');
    jest.spyOn(AuthService.getInstance(), 'authenticate')
      .mockResolvedValue('mock-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('checkPermission', () => {
    it('should return false when not authenticated', async () => {
      jest.spyOn(AuthService.getInstance(), 'authenticate')
        .mockResolvedValueOnce(null);

      const result = await permissionService.checkPermission('resource-1', 'read');
      expect(result).toBe(false);
    });

    it('should fetch and cache permissions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ read: true, write: false, delete: false })
      });

      const result = await permissionService.checkPermission('resource-1', 'read');
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const secondResult = await permissionService.checkPermission('resource-1', 'read');
      expect(secondResult).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('grantPermission', () => {
    it('should call API and invalidate cache', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await permissionService.grantPermission('resource-1', 'write');
      
      // Verify cache invalidation by forcing a new permission check
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ read: true, write: true, delete: false })
      });

      const result = await permissionService.checkPermission('resource-1', 'write');
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('revokePermission', () => {
    it('should call API and invalidate cache', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await permissionService.revokePermission('resource-1', 'write');
      
      // Verify cache invalidation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ read: true, write: false, delete: false })
      });

      const result = await permissionService.checkPermission('resource-1', 'write');
      expect(result).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});