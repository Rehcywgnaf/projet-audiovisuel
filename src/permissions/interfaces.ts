interface IPermissions {
  checkAccess(userId: string, resourceId: string, action: 'read' | 'write' | 'delete'): Promise<boolean>;
  getUserRole(userId: string): Promise<string>;
  getCachedPermissions(userId: string): Promise<Map<string, string[]>>;
}