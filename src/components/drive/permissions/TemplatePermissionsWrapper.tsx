import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Brain, Shield } from 'lucide-react';

import { validateDriveOperation } from '@/lib/drive/permissions/core';
import { permissionCache } from '@/lib/drive/permissions/cache';

const withPermissions = (WrappedComponent) => {
  return function TemplateManagerWithPermissions(props) {
    const [permissionStatus, setPermissionStatus] = useState({
      canRead: false,
      canWrite: false,
      canManage: false,
      loading: true
    });

    const [error, setError] = useState(null);

    useEffect(() => {
      const checkPermissions = async () => {
        try {
          const cachedPerms = await permissionCache.get('template-permissions');
          if (cachedPerms) {
            setPermissionStatus(cachedPerms);
            return;
          }

          const readPerm = await validateDriveOperation(props.userId, 'templates', 'read');
          const writePerm = await validateDriveOperation(props.userId, 'templates', 'write');
          const adminPerm = await validateDriveOperation(props.userId, 'templates', 'admin');

          const newStatus = {
            canRead: readPerm.granted,
            canWrite: writePerm.granted,
            canManage: adminPerm.granted,
            loading: false
          };

          setPermissionStatus(newStatus);
          permissionCache.set('template-permissions', newStatus);
        } catch (err) {
          setError(err.message);
          setPermissionStatus(prev => ({ ...prev, loading: false }));
        }
      };

      checkPermissions();
    }, [props.userId]);

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Erreur de vérification des permissions: {error}
          </AlertDescription>
        </Alert>
      );
    }

    if (permissionStatus.loading) {
      return (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 animate-pulse" />
              <span>Vérification des permissions...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!permissionStatus.canRead) {
      return (
        <Alert>
          <AlertDescription>
            Vous n'avez pas les permissions nécessaires pour accéder aux templates.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        {permissionStatus.canWrite && (
          <Card className="bg-blue-50">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <FileText className="w-4 h-4" />
                Mode édition activé
              </div>
            </CardContent>
          </Card>
        )}

        <WrappedComponent 
          {...props} 
          permissions={permissionStatus}
        />
      </div>
    );
  };
};

export default withPermissions;