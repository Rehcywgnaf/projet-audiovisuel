/**
 * TODO: Refactoring et Améliorations
 * 
 * 1. Architecture et Structure:
 *    - Extraire la logique API dans un service dédié (services/DriveService)
 *    - Déplacer les types dans un fichier séparé (types/drive-types)
 *    - Diviser en sous-composants : DriveStatus, QuotaDisplay, FileList, VersionCompare
 * 
 * 2. Intégration Google Drive:
 *    - Implémenter l'authentification réelle avec les credentials Google
 *    - Remplacer mockDriveAPI par de vrais appels API
 *    - Ajouter la gestion des quotas réels
 *    - Gérer la comparaison réelle du contenu des fichiers
 * 
 * 3. Système de Versioning:
 *    ✓ Interface de visualisation des versions
 *    ✓ Système de comparaison côte à côte
 *    ✓ Indicateurs de changements majeurs/mineurs
 *    - Implémenter la détection réelle des changements majeurs/mineurs
 *    - Ajouter des statistiques de modifications
 *    - Créer un système de tags pour les versions
 * 
 * 4. Gestion des Erreurs:
 *    - Améliorer la gestion des erreurs API
 *    - Ajouter des retries automatiques
 *    - Implémenter un système de logs détaillé
 * 
 * Note: Le composant utilise actuellement des données mockées pour le développement
 * et les tests. L'intégration avec l'API Google Drive nécessitera les credentials
 * appropriés et une refactorisation pour utiliser les vraies données.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Folder, Upload, AlertCircle, FileText, Settings, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

interface DriveError extends Error {
  code?: string;
  status?: number;
}

interface VersionedFile {
  id: string;
  name: string;
  currentVersion: number;
  versions: {
    id: string;
    version: number;
    createdAt: string;
    size: string;
    author: string;
    comment?: string;
  }[];
}

const IntegrationDrive = () => {
  const [driveState, setDriveState] = useState({
    isConnected: false,
    currentFolder: null,
    permissions: null,
    files: [] as DriveFile[],
    error: null as DriveError | null,
    isLoading: true,
    quotaUsed: 0,
    quotaTotal: 0,
    selectedFile: null as VersionedFile | null,
    showVersions: false
  });

  const [compareMode, setCompareMode] = useState({
    active: false,
    versionId: null as string | null
  });

  // Compare deux versions et retourne les différences
  const compareVersions = (v1: typeof driveState.selectedFile.versions[0], v2: typeof driveState.selectedFile.versions[0]) => {
    const differences = {
      size: v1.size !== v2.size,
      timeDiff: Math.abs(new Date(v1.createdAt).getTime() - new Date(v2.createdAt).getTime()),
      author: v1.author !== v2.author,
      changeType: 'minor' as 'minor' | 'major'
    };

    // Simuler la détection des changements majeurs
    // Dans la version réelle, cela dépendrait du contenu du fichier
    const sizeDiff = parseInt(v1.size) - parseInt(v2.size);
    differences.changeType = Math.abs(sizeDiff) > 100 ? 'major' : 'minor';

    return differences;
  };

  const handleVersionClick = (fileId: string) => {
    // Mock des versions pour l'exemple
    const mockVersions = {
      id: fileId,
      name: driveState.files.find(f => f.id === fileId)?.name || '',
      currentVersion: 3,
      versions: [
        {
          id: 'v3',
          version: 3,
          createdAt: new Date().toISOString(),
          size: '1.2 MB',
          author: 'Marie Martin',
          comment: 'Version finale'
        },
        {
          id: 'v2',
          version: 2,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          size: '1.1 MB',
          author: 'Jean Dupont',
          comment: 'Corrections mineures'
        },
        {
          id: 'v1',
          version: 1,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          size: '1.0 MB',
          author: 'Marie Martin',
          comment: 'Version initiale'
        }
      ]
    };

    setDriveState(prev => ({
      ...prev,
      selectedFile: mockVersions,
      showVersions: true
    }));
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      setDriveState(prev => ({ ...prev, isLoading: true }));
      
      // Mock de la restauration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!driveState.selectedFile) return;

      // Mettre à jour la version courante
      const updatedVersions = driveState.selectedFile.versions.map(v => ({
        ...v,
        version: v.id === versionId ? driveState.selectedFile!.currentVersion : v.version
      }));

      setDriveState(prev => ({
        ...prev,
        isLoading: false,
        selectedFile: {
          ...prev.selectedFile!,
          currentVersion: prev.selectedFile!.versions.find(v => v.id === versionId)?.version || prev.selectedFile!.currentVersion,
          versions: updatedVersions
        }
      }));
    } catch (error) {
      setDriveState(prev => ({
        ...prev,
        error: new Error("Erreur lors de la restauration de la version") as DriveError,
        isLoading: false
      }));
    }
  };

  const handleCompareClick = (versionId: string) => {
    setCompareMode({
      active: true,
      versionId
    });
  };

  useEffect(() => {
    const initializeDrive = async () => {
      try {
        // Mock de l'initialisation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simuler des quotas
        const quotaData = {
          usage: 1024 * 1024 * 500, // 500MB
          limit: 1024 * 1024 * 1024 * 15 // 15GB
        };

        // Simuler une liste de fichiers
        const mockFiles = [
          {
            id: '1',
            name: 'Document.pdf',
            mimeType: 'application/pdf',
            modifiedTime: new Date().toISOString(),
            size: '1.2 MB'
          },
          {
            id: '2',
            name: 'Presentation.pptx',
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            modifiedTime: new Date().toISOString(),
            size: '2.5 MB'
          }
        ];

        setDriveState(prev => ({
          ...prev,
          isConnected: true,
          isLoading: false,
          quotaUsed: quotaData.usage,
          quotaTotal: quotaData.limit,
          files: mockFiles,
          permissions: {
            canEdit: true,
            canShare: true,
            isOwner: true
          }
        }));
      } catch (error) {
        setDriveState(prev => ({
          ...prev,
          error: new Error("Erreur de connexion à Google Drive") as DriveError,
          isLoading: false
        }));
      }
    };

    initializeDrive();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    try {
      setDriveState(prev => ({ ...prev, isLoading: true }));
      
      // Mock de l'upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFiles = Array.from(files).map(file => ({
        id: Math.random().toString(),
        name: file.name,
        mimeType: file.type,
        modifiedTime: new Date().toISOString(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      
      setDriveState(prev => ({
        ...prev,
        isLoading: false,
        files: [...prev.files, ...newFiles]
      }));
    } catch (error) {
      setDriveState(prev => ({
        ...prev,
        error: new Error("Erreur lors de l'upload") as DriveError,
        isLoading: false
      }));
    }
  };

  const handleCreateFolder = async (folderName: string) => {
    try {
      setDriveState(prev => ({ ...prev, isLoading: true }));
      
      // Mock de la création de dossier
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDriveState(prev => ({
        ...prev,
        isLoading: false,
        currentFolder: folderName
      }));
    } catch (error) {
      setDriveState(prev => ({
        ...prev,
        error: new Error("Erreur lors de la création du dossier") as DriveError,
        isLoading: false
      }));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration Drive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* État de la connexion */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${driveState.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{driveState.isConnected ? 'Connecté' : 'Déconnecté'}</span>
              </div>
              {driveState.permissions && (
                <div className="flex gap-2 text-sm">
                  <span className={driveState.permissions.canEdit ? 'text-green-600' : 'text-gray-400'}>
                    Édition
                  </span>
                  <span className={driveState.permissions.canShare ? 'text-green-600' : 'text-gray-400'}>
                    Partage
                  </span>
                  <span className={driveState.permissions.isOwner ? 'text-green-600' : 'text-gray-400'}>
                    Propriétaire
                  </span>
                </div>
              )}
            </div>

            {/* Gestion des erreurs */}
            {driveState.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {driveState.error.message}
                  {driveState.error.code && ` (Code: ${driveState.error.code})`}
                </AlertDescription>
              </Alert>
            )}

            {/* Utilisation du stockage */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Utilisation du stockage</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 rounded-full h-2"
                  style={{
                    width: `${(driveState.quotaUsed / driveState.quotaTotal * 100) || 0}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{(driveState.quotaUsed / (1024 * 1024)).toFixed(2)} MB</span>
                <span>{(driveState.quotaTotal / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
              </div>
            </div>

            {/* Actions principales */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  multiple
                />
                <Upload className="w-5 h-5" />
                Upload Fichier
              </label>
              <button
                className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                onClick={() => handleCreateFolder('Nouveau Dossier')}
              >
                <Folder className="w-5 h-5" />
                Nouveau Dossier
              </button>
            </div>

            {/* Liste des fichiers */}
            <div className="space-y-2">
              <h3 className="font-medium">Fichiers récents</h3>
              <div className="border rounded-lg divide-y">
                {driveState.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{file.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleVersionClick(file.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        Versions
                      </button>
                      <span className="text-sm text-gray-500">{file.size}</span>
                    </div>
                  </div>
                ))}
                {driveState.files.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    Aucun fichier
                  </div>
                )}
              </div>
            </div>

            {/* Mode comparaison */}
            {compareMode.active && driveState.selectedFile && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Comparaison des versions</h3>
                  <button
                    onClick={() => setCompareMode({ active: false, versionId: null })}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Fermer la comparaison
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Version courante */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Version actuelle</h4>
                    {(() => {
                      const currentVersion = driveState.selectedFile.versions.find(
                        v => v.version === driveState.selectedFile.currentVersion
                      );
                      return currentVersion ? (
                        <div>
                          <p className="text-sm text-gray-600">Taille: {currentVersion.size}</p>
                          <p className="text-sm text-gray-600">Auteur: {currentVersion.author}</p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(currentVersion.createdAt).toLocaleString()}
                          </p>
                          {currentVersion.comment && (
                            <p className="text-sm text-gray-600 mt-2">{currentVersion.comment}</p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* Version comparée */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Version comparée</h4>
                    {(() => {
                      const comparedVersion = driveState.selectedFile.versions.find(
                        v => v.id === compareMode.versionId
                      );
                      if (!comparedVersion) return null;

                      const currentVersion = driveState.selectedFile.versions.find(
                        v => v.version === driveState.selectedFile.currentVersion
                      );
                      if (!currentVersion) return null;

                      const differences = compareVersions(comparedVersion, currentVersion);

                      return (
                        <div>
                          <p className="text-sm text-gray-600">
                            Taille: {comparedVersion.size}
                            {differences.size && (
                              <span className="text-yellow-600 ml-2">(Modifié)</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Auteur: {comparedVersion.author}
                            {differences.author && (
                              <span className="text-yellow-600 ml-2">(Différent)</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(comparedVersion.createdAt).toLocaleString()}
                            <span className="text-gray-500 ml-2">
                              ({Math.floor(differences.timeDiff / (1000 * 60 * 60 * 24))} jours d'écart)
                            </span>
                          </p>
                          {comparedVersion.comment && (
                            <p className="text-sm text-gray-600 mt-2">{comparedVersion.comment}</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Panel des versions */}
            {driveState.selectedFile && driveState.showVersions && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Versions de {driveState.selectedFile.name}
                  </h3>
                  <button
                    onClick={() => setDriveState(prev => ({ ...prev, showVersions: false }))}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Fermer
                  </button>
                </div>
                <div className="space-y-2">
                  {driveState.selectedFile.versions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-3 border rounded-lg ${
                        version.version === driveState.selectedFile?.currentVersion
                          ? 'bg-blue-50 border-blue-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {version.version === driveState.selectedFile.currentVersion ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span>Version {version.version}</span>
                          {version.version !== driveState.selectedFile.currentVersion && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              compareVersions(version, driveState.selectedFile.versions.find(v => v.version === driveState.selectedFile.currentVersion)).changeType === 'major'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {compareVersions(version, driveState.selectedFile.versions.find(v => v.version === driveState.selectedFile.currentVersion)).changeType === 'major'
                                ? 'Changements majeurs'
                                : 'Changements mineurs'}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{version.size}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Par {version.author} le {new Date(version.createdAt).toLocaleString()}</div>
                        {version.comment && <div className="mt-1">{version.comment}</div>}
                      </div>
                      <div className="mt-2 flex gap-2">
                        {version.version !== driveState.selectedFile.currentVersion && (
                          <>
                            <button
                              onClick={() => handleRestoreVersion(version.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restaurer
                            </button>
                            <button
                              onClick={() => handleCompareClick(version.id)}
                              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                            >
                              Comparer
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationDrive;
