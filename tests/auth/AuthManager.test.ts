import { render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import AuthManager from '../../src/components/AuthManager';

describe('AuthManager Tests', () => {
  let authManager: AuthManager;

  beforeEach(() => {
    authManager = AuthManager.getInstance();
  });

  describe('Core Functionality', () => {
    test('should maintain singleton instance', () => {
      const instance1 = AuthManager.getInstance();
      const instance2 = AuthManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('should initialize with empty caches', () => {
      expect(authManager['permissionsCache'].size).toBe(0);
      expect(authManager['teamRolesCache'].size).toBe(0);
    });
  });

  describe('Permission Management', () => {
    test('should get user permissions', async () => {
      const userId = 'testUser123';
      const permissions = await authManager.getUserPermissions(userId);
      expect(Array.isArray(permissions)).toBe(true);
    });

    test('should handle missing user permissions', async () => {
      const permissions = await authManager.getUserPermissions('nonexistent');
      expect(permissions).toEqual([]);
    });
  });

  describe('React Hook Usage', () => {
    const userId = 'testUser';
    const resourceId = 'testResource';

    test('should provide loading state initially', () => {
      const { result } = renderHook(() => 
        AuthManager.usePermissions(userId, resourceId)
      );
      expect(result.current.loading).toBe(true);
    });

    test('should update access state after load', async () => {
      const { result } = renderHook(() => 
        AuthManager.usePermissions(userId, resourceId)
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.loading).toBe(false);
      expect(typeof result.current.hasAccess).toBe('boolean');
    });
  });
});