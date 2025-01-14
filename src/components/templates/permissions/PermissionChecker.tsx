import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { validateDriveOperation } from '@/lib/drive/permissions/core';
import { permissionCache } from '@/lib/drive/permissions/cache';

interface PermissionState {
  canRead: boolean;
  canWrite: boolean;
  canManage: boolean;
  loading: boolean;
}

interface PermissionCheckerProps {
  userId: string;
  children: (permissions: PermissionState) => React.ReactNode;
  onError?: (error: string) => void;
}

const PermissionChecker = ({ 
  userId, 
  children, 
  onError 
}: PermissionCheckerProps) => {
  const [permissions, setPermissions] = useState<PermissionState>({
    canRead: false,
    canWrite: false,
    canManage: false,
    loading: true
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cachedPerms = await permissionCache.get('template-permissions');
        if (cachedPerms) {
          setPermissions(cachedPerms);
          return;
        }

        const readPerm = await validateDriveOperation(userId, 'templates', 'read');
        const writePerm = await validateDriveOperation(userId, 'templates', 'write');
        const adminPerm = await validateDriveOperation(userId, 'templates', 'admin');

        const newPermissions = {
          canRead: readPerm.granted,
          canWrite: writePerm.granted,
          canManage: adminPerm.granted,
          loading: false
        };

        setPermissions(newPermissions);
        permissionCache.set('template-permissions', newPermissions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMessage);
        onError?.(errorMessage);
        setPermissions(prev => ({ ...prev, loading: false }));
      }
    };

    checkPermissions();
  }, [userId, onError]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erreur de vérification des permissions: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (permissions.loading) {
    return (
      <div className="flex items-center gap-2 p-4">
        <Shield className="w-4 h-4 animate-pulse" />
        <span>Vérification des permissions...</span>
      </div>
    );
  }

  return <>{children(permissions)}</>;
};

export default PermissionChecker;