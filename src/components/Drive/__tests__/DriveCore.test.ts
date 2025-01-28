import DriveCore from '../Core/DriveCore';
import { AuthService } from '../../../services/auth/AuthService';
import { PermissionService } from '../../../services/auth/PermissionService';
import { CacheManager } from '../cache/CacheManager';
import { ErrorHandling } from '../error/ErrorHandling';

jest.mock('../../../services/auth/AuthService');
jest.mock('../../../services/auth/PermissionService');
jest.mock('../cache/CacheManager');
jest.mock('../error/ErrorHandling');

describe('DriveCore', () => {
  let driveCore: DriveCore;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockPermissionService: jest.Mocked<PermissionService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup auth mock
    mockAuthService = AuthService.getInstance() as jest.Mocked<AuthService>;
    mockAuthService.authenticate.mockResolvedValue('mock-token');

    // Setup permissions mock
    mockPermissionService = new PermissionService() as jest.Mocked<PermissionService>;
    mockPermissionService.checkPermission.mockResolvedValue(true);

    driveCore = DriveCore.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = DriveCore.getInstance();
      const instance2 = DriveCore.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('createFile', () => {
    it('should check permissions before creating file', async () => {
      const folderId = 'test-folder';
      await driveCore.createFile('test.txt', 'content', folderId);
      
      expect(mockPermissionService.checkPermission)
        .toHaveBeenCalledWith(folderId, 'write');
    });

    it('should handle permission denied', async () => {
      mockPermissionService.checkPermission.mockResolvedValue(false);
      
      await expect(
        driveCore.createFile('test.txt', 'content', 'folder-id')
      ).rejects.toThrow();
    });
  });

  describe('readFile', () => {
    it('should check permissions before reading', async () => {
      const fileId = 'test-file';
      await driveCore.readFile(fileId);
      
      expect(mockPermissionService.checkPermission)
        .toHaveBeenCalledWith(fileId, 'read');
    });
  });

  describe('updateFile', () => {
    it('should check permissions before updating', async () => {
      const fileId = 'test-file';
      await driveCore.updateFile(fileId, 'new content');
      
      expect(mockPermissionService.checkPermission)
        .toHaveBeenCalledWith(fileId, 'write');
    });
  });

  describe('deleteFile', () => {
    it('should check permissions before deleting', async () => {
      const fileId = 'test-file';
      await driveCore.deleteFile(fileId);
      
      expect(mockPermissionService.checkPermission)
        .toHaveBeenCalledWith(fileId, 'delete');
    });
  });
});
