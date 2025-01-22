import React, { useState } from 'react';
import { Shield, Users, Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DrivePermissions = () => {
  const [permissions, setPermissions] = useState({
    folders: [
      {
        name: 'Documents',
        permissions: {
          admin: ['owner', 'organizer'],
          editor: ['editor'],
          viewer: ['viewer']
        },
        inherited: true
      },
      {
        name: 'Templates',
        permissions: {
          admin: ['owner'],
          editor: ['editor'],
          viewer: ['commenter']
        },
        inherited: false
      }
    ],
    globalRules: [
      {
        name: 'Héritage automatique',
        enabled: true,
        description: 'Les sous-dossiers héritent des permissions parent'
      },
      {
        name: 'Restriction de partage',
        enabled: true,
        description: 'Limité aux utilisateurs de l\'organisation'
      },
      {
        name: 'Protection version',
        enabled: true,
        description: 'Versions accessibles uniquement aux éditeurs'
      }
    ]
  });

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
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Synchronisation avec Google Workspace</AlertTitle>
        <AlertDescription>
          Les permissions sont synchronisées avec les rôles utilisateurs de l'application
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Règles globales</h3>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {permissions.globalRules.map((rule) => (
            <div key={rule.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{rule.name}</p>
                <p className="text-sm text-gray-500">{rule.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={rule.enabled}
                  onChange={() => {}}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Permissions par dossier</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        {permissions.folders.map((folder) => (
          <div key={folder.name} className="p-4 border-b last:border-b-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">{folder.name}</h4>
                {folder.inherited && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Hérité du dossier parent
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(folder.permissions).map(([role, perms]) => (
                <div key={role} className="flex items-center text-sm">
                  <span className="w-24 font-medium">{role}:</span>
                  <div className="flex gap-2">
                    {perms.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Réinitialiser
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Appliquer les changements
        </button>
      </div>
    </div>
  );
};

export default DrivePermissions;