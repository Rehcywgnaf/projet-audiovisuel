import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Trash2, FolderOpen, Mail, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DrivePermissions = () => {
  const [permissions, setPermissions] = useState([
    {
      id: '1',
      email: 'production@example.com',
      role: 'editor',
      type: 'user',
      folder: 'Documents Projet',
      addedOn: new Date().toISOString()
    },
    {
      id: '2',
      email: 'technique@example.com',
      role: 'viewer',
      type: 'user',
      folder: 'Assets',
      addedOn: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const [error, setError] = useState(null);

  const roleColors = {
    owner: 'bg-purple-100 text-purple-800',
    editor: 'bg-blue-100 text-blue-800',
    viewer: 'bg-green-100 text-green-800'
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleRemovePermission = (id) => {
    try {
      setPermissions(permissions.filter(p => p.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression de la permission");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Permissions Drive
          </CardTitle>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {permission.type === 'user' ? (
                        <Mail className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{permission.email}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <FolderOpen className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{permission.folder}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        Ajouté le {formatDate(permission.addedOn)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${roleColors[permission.role]}`}>
                      {permission.role}
                    </span>
                    <button
                      onClick={() => handleRemovePermission(permission.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrivePermissions;