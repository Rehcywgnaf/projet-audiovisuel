import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Trash2, FolderOpen, Mail, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types et constantes
interface DrivePermission {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  type: 'user' | 'group';
  folder: string;
  addedOn: string;
  inherited?: boolean;
  parentFolder?: string;
}

const ROLE_TYPES = {
  owner: { label: 'Propriétaire', color: 'bg-purple-100 text-purple-800' },
  editor: { label: 'Éditeur', color: 'bg-blue-100 text-blue-800' },
  viewer: { label: 'Lecteur', color: 'bg-green-100 text-green-800' }
};

const FOLDER_TYPES = {
  root: 'Dossier racine',
  project: 'Dossiers projets',
  shared: 'Dossiers partagés'
};

// Service de mock pour les permissions Drive
const mockDriveService = {
  initialized: false,

  async initialize() {
    this.initialized = true;
  },

  async addPermission(email: string, role: string, folderId: string): Promise<DrivePermission> {
    return {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role: role as 'owner' | 'editor' | 'viewer',
      type: 'user',
      folder: folderId,
      addedOn: new Date().toISOString()
    };
  },

  async getFolderPermissions(folderId: string): Promise<DrivePermission[]> {
    return [
      {
        id: '1',
        email: 'production@example.com',
        role: 'editor',
        type: 'user',
        folder: folderId,
        addedOn: new Date().toISOString()
      },
      {
        id: '2',
        email: 'technique@example.com',
        role: 'viewer',
        type: 'user',
        folder: folderId,
        addedOn: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },

  async getInheritedPermissions(folderId: string): Promise<DrivePermission[]> {
    return [{
      id: '3',
      email: 'admin@example.com',
      role: 'owner',
      type: 'user',
      folder: 'parent-folder',
      addedOn: new Date().toISOString(),
      inherited: true,
      parentFolder: 'Dossier Parent'
    }];
  },

  async removePermission(permissionId: string) {
    // Simule la suppression
    console.log('Permission supprimée:', permissionId);
  }
};

const DrivePermissions = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [permissions, setPermissions] = useState<DrivePermission[]>([]);
  const [error, setError] = useState(null);
  const [showInherited, setShowInherited] = useState(true);
  const [inheritedPermissions, setInheritedPermissions] = useState<DrivePermission[]>([]);
  const [newPermission, setNewPermission] = useState({
    email: '',
    role: 'viewer',
    folder: '',
    type: 'user'
  });

  // Initialisation et chargement des permissions
  useEffect(() => {
    const initAndLoad = async () => {
      try {
        await mockDriveService.initialize();
        const folderPerms = await mockDriveService.getFolderPermissions('root');
        setPermissions(folderPerms);
      } catch (err) {
        setError('Erreur lors de l\'initialisation');
      }
    };

    initAndLoad();
  }, []);

  // Chargement des permissions héritées
  useEffect(() => {
    const loadInherited = async () => {
      if (!showInherited) return;
      try {
        const inherited = await mockDriveService.getInheritedPermissions('root');
        setInheritedPermissions(inherited);
      } catch (err) {
        console.error('Erreur chargement permissions héritées:', err);
      }
    };

    loadInherited();
  }, [showInherited]);

  const handleRemovePermission = async (id: string) => {
    try {
      await mockDriveService.removePermission(id);
      setPermissions(permissions.filter(p => p.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleAddPermission = async () => {
    try {
      const added = await mockDriveService.addPermission(
        newPermission.email,
        newPermission.role,
        newPermission.folder || 'root'
      );
      
      setPermissions([...permissions, added]);
      setIsAddDialogOpen(false);
      setNewPermission({
        email: '',
        role: 'viewer',
        folder: '',
        type: 'user'
      });
    } catch (err) {
      setError("Erreur lors de l'ajout");
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderInheritedInfo = (permission: DrivePermission) => {
    if (!permission.inherited) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
        <FolderOpen className="w-3 h-3" />
        <span>Hérité de {permission.parentFolder}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Permissions Drive
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une permission</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="utilisateur@exemple.com"
                    value={newPermission.email}
                    onChange={(e) => setNewPermission({ ...newPermission, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={newPermission.role}
                    onValueChange={(value) => setNewPermission({ ...newPermission, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_TYPES).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="folder">Dossier</Label>
                  <Select
                    value={newPermission.folder}
                    onValueChange={(value) => setNewPermission({ ...newPermission, folder: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un dossier" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FOLDER_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={handleAddPermission}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter la permission
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Permissions totales : {permissions.length + inheritedPermissions.length}
              </span>
              <span className="text-xs text-gray-400">
                ({inheritedPermissions.length} héritées)
              </span>
            </div>
            <button
              onClick={() => setShowInherited(!showInherited)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showInherited ? 'Masquer permissions héritées' : 'Afficher permissions héritées'}
            </button>
          </div>
          
          <div className="space-y-4">
            {[...permissions, ...(showInherited ? inheritedPermissions : [])].map((permission) => (
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
                      {renderInheritedInfo(permission)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${ROLE_TYPES[permission.role].color}`}>
                      {ROLE_TYPES[permission.role].label}
                    </span>
                    {!permission.inherited && (
                      <button
                        onClick={() => handleRemovePermission(permission.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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