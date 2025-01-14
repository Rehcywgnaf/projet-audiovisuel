import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PermissionChecker from '../permissions/PermissionChecker';
import { validateDriveOperation } from '@/lib/drive/permissions/core';
import { permissionCache } from '@/lib/drive/permissions/cache';

// Mock des dépendances
jest.mock('@/lib/drive/permissions/core');
jest.mock('@/lib/drive/permissions/cache');

describe('PermissionChecker Component', () => {
  const mockValidateOperation = validateDriveOperation as jest.Mock;
  const mockCacheGet = permissionCache.get as jest.Mock;
  const mockCacheSet = permissionCache.set as jest.Mock;

  beforeEach(() => {
    mockValidateOperation.mockClear();
    mockCacheGet.mockClear();
    mockCacheSet.mockClear();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      mockCacheGet.mockResolvedValue(null);
      mockValidateOperation.mockImplementation(() => new Promise(() => {}));

      render(
        <PermissionChecker userId="user1">
          {() => <div>Content</div>}
        </PermissionChecker>
      );

      expect(screen.getByText('Vérification des permissions...')).toBeInTheDocument();
    });
  });

  describe('Cache Handling', () => {
    it('should use cached permissions when available', async () => {
      const cachedPermissions = {
        canRead: true,
        canWrite: true,
        canManage: false,
        loading: false
      };
      
      mockCacheGet.mockResolvedValue(cachedPermissions);
      const mockChildren = jest.fn().mockReturnValue(<div>Cached Content</div>);

      render(
        <PermissionChecker userId="user1">
          {mockChildren}
        </PermissionChecker>
      );

      await waitFor(() => {
        expect(mockChildren).toHaveBeenCalledWith(cachedPermissions);
      });

      expect(mockValidateOperation).not.toHaveBeenCalled();
    });
  });

  describe('Permission Checking', () => {
    it('should check all permission levels when cache is empty', async () => {
      mockCacheGet.mockResolvedValue(null);
      mockValidateOperation.mockResolvedValue({ granted: true });

      render(
        <PermissionChecker userId="user1">
          {() => <div>Fresh Content</div>}
        </PermissionChecker>
      );

      await waitFor(() => {
        expect(mockValidateOperation).toHaveBeenCalledTimes(3); // read, write, admin
      });

      expect(mockCacheSet).toHaveBeenCalledTimes(1);
    });

    it('should handle permission check failure', async () => {
      const error = new Error('Permission check failed');
      mockCacheGet.mockResolvedValue(null);
      mockValidateOperation.mockRejectedValue(error);

      const mockOnError = jest.fn();

      render(
        <PermissionChecker userId="user1" onError={mockOnError}>
          {() => <div>Error Content</div>}
        </PermissionChecker>
      );

      await waitFor(() => {
        expect(screen.getByText(/Erreur de vérification des permissions/)).toBeInTheDocument();
      });

      expect(mockOnError).toHaveBeenCalledWith(error.message);
    });
  });

  describe('Children Rendering', () => {
    it('should pass correct permissions to children', async () => {
      mockCacheGet.mockResolvedValue(null);
      mockValidateOperation
        .mockResolvedValueOnce({ granted: true })  // read
        .mockResolvedValueOnce({ granted: false }) // write
        .mockResolvedValueOnce({ granted: false }); // admin

      const mockChildren = jest.fn().mockReturnValue(<div>Permission Content</div>);

      render(
        <PermissionChecker userId="user1">
          {mockChildren}
        </PermissionChecker>
      );

      await waitFor(() => {
        expect(mockChildren).toHaveBeenCalledWith(expect.objectContaining({
          canRead: true,
          canWrite: false,
          canManage: false,
          loading: false
        }));
      });
    });
  });
});