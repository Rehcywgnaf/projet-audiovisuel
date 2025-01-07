import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { File, Settings, AlertCircle } from 'lucide-react';

const VersionControl = () => {
  const [versions, setVersions] = useState([
    {
      id: 'v1',
      metadata: {
        title: 'Version initiale',
        description: 'Version de base du document'
      },
      timestamp: '2025-01-06T10:00:00.000Z'
    },
    {
      id: 'v2',
      metadata: {
        title: 'Mise à jour majeure',
        description: 'Modification des structures principales'
      },
      timestamp: '2025-01-06T14:00:00.000Z'
    }
  ]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [error, setError] = useState(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="w-5 h-5" />
          Contrôle des Versions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liste des versions */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Versions Disponibles</h3>
            <div className="space-y-2">
              {versions.map((version, index) => (
                <div
                  key={index}
                  className={`p-2 rounded cursor-pointer ${
                    selectedVersion === version.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{version.metadata.title}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(version.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {version.metadata.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions disponibles */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Actions</h3>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-center gap-2 p-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {/* Logique de sauvegarde */}}
              >
                <File className="w-4 h-4" />
                Sauvegarder Version Actuelle
              </button>

              <button
                className="w-full flex items-center justify-center gap-2 p-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setCompareMode(true)}
                disabled={!selectedVersion}
              >
                <Settings className="w-4 h-4" />
                Comparer les Versions
              </button>

              <button
                className="w-full flex items-center justify-center gap-2 p-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                onClick={() => {/* Logique de restauration */}}
                disabled={!selectedVersion}
              >
                <Settings className="w-4 h-4" />
                Restaurer Version
              </button>
            </div>
          </div>
        </div>

        {/* Zone de comparaison */}
        {compareMode && selectedVersion && (
          <div className="mt-4 border rounded-lg p-4">
            <h3 className="font-medium mb-3">Comparaison des Versions</h3>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                Comparaison en cours entre la version actuelle et {
                  versions.find(v => v.id === selectedVersion)?.metadata.title
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VersionControl;
