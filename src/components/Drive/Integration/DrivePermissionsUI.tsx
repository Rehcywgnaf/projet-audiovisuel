import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Users, Settings, AlertCircle, FolderTree, Lock, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { DrivePerms } from '../Core/DrivePerms';
import { useDriveAuth } from '../Auth/DriveAuthProvider';

interface FolderPermission {
  id: string;
  name: string;
  permissions: {
    admin: string[];
    editor: string[];
    viewer: string[];
  };
  inherited: boolean;
  path: string;
}

interface GlobalRule {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  key: 'inheritanceRule' | 'sharingRule' | 'versionRule';
}

const DrivePermissionsUI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<FolderPermission[]>([]);
  const [globalRules, setGlobalRules] = useState<GlobalRule[]>([
    {
      id: '1',
      name: 'Héritage automatique',
      enabled: true,
      description: 'Les sous-dossiers héritent des permissions parent',
      key: 'inheritanceRule'
    },
    {
      id: '2',
      name: 'Restriction de partage',
      enabled: true,
      description: 'Limité aux utilisateurs de l\'organisation',
      key: 'sharingRule'
    },
    {
      id: '3',
      name: 'Protection version',
      enabled: true,
      description: 'Versions accessibles uniquement aux éditeurs',
      key: 'versionRule'
    }
  ]);

  const { isAuthenticated } = useDriveAuth();
  const drivePerms = DrivePerms.getInstance();

  const handleError = useCallback((error: Error) => {
    console.error('Erreur permissions:', error);
  }, []);

  const loadPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const perms = await drivePerms.getFolderPermissions();
      setPermissions(perms);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Erreur de chargement des permissions'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleGlobalRule = async (ruleId: string) => {
    try {
      const rule = globalRules.find(r => r.id === ruleId);
      if (!rule) return;

      const updatedRules = globalRules.map(r => 
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      );

      await drivePerms.updateGlobalRule(rule.key, !rule.enabled);
      setGlobalRules(updatedRules);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Erreur de mise à jour de la règle'));
    }
  };

  const updatePermission = async (
    folderId: string,
    userId: string,
    newRole: 'admin' | 'editor' | 'viewer'
  ) => {
    try {
      await drivePerms.updatePermission(folderId, userId, newRole);
      await loadPermissions();
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Erreur de mise à jour des permissions'));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPermissions();
    }
  }, [isAuthenticated, loadPermissions]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Permissions Google Drive</h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Configuration de sécurité</span>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Synchronisation avec Google Workspace</AlertTitle>
        <AlertDescription>
          Les permissions sont synchronisées avec les rôles utilisateurs de l'application
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Règles globales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {globalRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{rule.name}</h4>
                <p className="text-sm text-gray-500">{rule.description}</p>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => toggleGlobalRule(rule.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            Permissions par dossier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {permissions.map((folder) => (
              <div
                key={folder.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{folder.name}</h4>
                      {folder.inherited && (
                        <Badge variant="secondary" className="text-xs">
                          Hérité
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{folder.path}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <Lock className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-4">
                  {Object.entries(folder.permissions).map(([role, users]) => (
                    <div key={role} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium">
                        {role.charAt(0).toUpperCase() + role.slice(1)}:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {users.map((user) => (
                          <Badge
                            key={user}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <User className="w-3 h-3" />
                            <span>{user}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Réinitialiser
        </Button>
        <Button>
          Appliquer les changements
        </Button>
      </div>
    </div>
  );
};

export default DrivePermissionsUI;