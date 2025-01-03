import React, { useState } from 'react';
import { Shield, Mail, UserPlus, AlertTriangle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AuthenticationManager = () => {
  const [users, setUsers] = useState([
    {
      email: 'webmaster@audiovisuel.com',
      role: 'admin',
      status: 'active',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      authMethod: 'google'
    },
    {
      email: 'producer@studio.com',
      role: 'editor',
      status: 'active',
      permissions: ['read', 'write'],
      authMethod: 'google'
    },
    {
      email: 'viewer@client.com',
      role: 'viewer',
      status: 'pending',
      permissions: ['read'],
      authMethod: 'google'
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion des Accès</h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Authentification Google</span>
        </div>
      </div>

      <Alert>
        <Mail className="w-4 h-4" />
        <AlertTitle>Connexion via Google Workspace</AlertTitle>
        <AlertDescription>
          Les utilisateurs se connectent avec leur compte Google professionnel.
          Les autorisations sont gérées par le WebMaster.
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Utilisateurs actuels</h3>
        </div>
        {users.map((user) => (
          <div key={user.email} className="p-4 border-b last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">{user.email}</h4>
                  <span className="text-sm text-gray-500">{user.role}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user.status === 'active' ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Réinitialiser
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Ajouter utilisateur</span>
        </button>
      </div>
    </div>
  );
};

export default AuthenticationManager;