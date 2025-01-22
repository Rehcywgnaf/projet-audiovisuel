import React, { useState } from 'react';
import { Shield, Edit2, Trash2, Plus, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RoleManager = () => {
  const [roles, setRoles] = useState([
    {
      name: 'Admin',
      description: 'Accès complet et gestion des utilisateurs',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles'],
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Éditeur',
      description: 'Modification et gestion des documents',
      permissions: ['read', 'write', 'comment'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Lecteur',
      description: 'Lecture seule des documents',
      permissions: ['read', 'comment'],
      color: 'bg-green-100 text-green-800'
    }
  ]);

  const [editingRole, setEditingRole] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion des Rôles</h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Configuration des accès</span>
        </div>
      </div>

      {/* Alerte d'information */}
      <Alert>
        <Shield className="w-4 h-4" />
        <AlertTitle>Rôles et Permissions</AlertTitle>
        <AlertDescription>
          Les modifications des rôles affectent tous les utilisateurs associés.
          Les changements sont synchronisés avec Google Drive.
        </AlertDescription>
      </Alert>

      {/* Liste des rôles */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Rôles disponibles</h3>
        </div>
        <div className="divide-y">
          {roles.map((role) => (
            <div key={role.name} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                    {role.name}
                  </span>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => setEditingRole(role)}
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => {/* Logique de suppression */}}
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span 
                    key={permission}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Réinitialiser
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau rôle</span>
        </button>
      </div>

      {/* Modal d'édition (à implémenter) */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Modifier le rôle</h3>
            {/* Formulaire d'édition */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingRole.name}
                />
              </div>
              {/* Autres champs */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => setEditingRole(null)}
                >
                  Annuler
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager;