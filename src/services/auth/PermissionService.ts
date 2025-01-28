import { AuthService } from './AuthService';
import { Permission, PermissionSet, PermissionAction, PermissionRequest } from './types/Permission';

export class PermissionService {
  private authService: AuthService;
  private permissionCache: Map<string, PermissionSet>;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.authService = AuthService.getInstance();
    this.permissionCache = new Map();
  }

  async checkPermission(resourceId: string, action: PermissionAction): Promise<boolean> {
    try {
      const token = await this.authService.authenticate();
      if (!token) return false;

      const permissions = await this.getPermissions(resourceId);
      return permissions[action];
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  async batchCheckPermissions(requests: PermissionRequest[]): Promise<boolean[]> {
    try {
      const token = await this.authService.authenticate();
      if (!token) return requests.map(() => false);

      const results = await Promise.all(
        requests.map(request => this.checkPermission(request.resourceId, request.action))
      );

      return results;
    } catch (error) {
      console.error('Batch permission check failed:', error);
      return requests.map(() => false);
    }
  }

  private async getPermissions(resourceId: string): Promise<Permission> {
    const cached = this.permissionCache.get(resourceId);
    if (this.isCacheValid(cached)) {
      return cached.permissions;
    }

    const permissions = await this.fetchPermissions(resourceId);
    this.cachePermissions(resourceId, permissions);
    return permissions;
  }

  private async fetchPermissions(resourceId: string): Promise<Permission> {
    try {
      const response = await fetch(`/api/permissions/${resourceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.authService.authenticate()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return { read: false, write: false, delete: false };
    }
  }

  async grantPermission(resourceId: string, action: PermissionAction): Promise<void> {
    try {
      const token = await this.authService.authenticate();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/permissions/${resourceId}/grant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error('Failed to grant permission');
      }

      this.invalidateCache(resourceId);
    } catch (error) {
      console.error('Failed to grant permission:', error);
      throw new Error('Permission grant failed');
    }
  }

  async revokePermission(resourceId: string, action: PermissionAction): Promise<void> {
    try {
      const token = await this.authService.authenticate();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/permissions/${resourceId}/revoke`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error('Failed to revoke permission');
      }

      this.invalidateCache(resourceId);
    } catch (error) {
      console.error('Failed to revoke permission:', error);
      throw new Error('Permission revocation failed');
    }
  }

  private isCacheValid(cached?: PermissionSet): boolean {
    if (!cached) return false;
    return Date.now() - cached.lastUpdated < PermissionService.CACHE_DURATION;
  }

  private cachePermissions(resourceId: string, permissions: Permission): void {
    this.permissionCache.set(resourceId, {
      resourceId,
      permissions,
      lastUpdated: Date.now()
    });
  }

  private invalidateCache(resourceId: string): void {
    this.permissionCache.delete(resourceId);
  }
}