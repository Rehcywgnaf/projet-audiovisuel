import React, { useState } from 'react';
import { CheckCircle2, Circle, GitCompare, FileText } from 'lucide-react';

const VersionControl = () => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  
  const versions = [
    {
      id: 'v1.3',
      date: '2024-01-26 15:30',
      author: 'Sophie Martin',
      changes: 'Mise à jour section budget',
      status: 'current'
    },
    {
      id: 'v1.2',
      date: '2024-01-25 11:20',
      author: 'Jean Dupont',
      changes: 'Ajout annexes techniques',
      status: 'previous'
    },
    {
      id: 'v1.1',
      date: '2024-01-24 09:45',
      author: 'Marie Lambert',
      changes: 'Correction orthographe',
      status: 'previous'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Historique des versions</h2>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Dernière mise à jour: {versions[0].date}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {versions.map((version) => (
          <div 
            key={version.id}
            className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer
              ${selectedVersion === version.id ? 'bg-blue-50' : ''}
              ${version.status === 'current' ? 'border-l-4 border-l-blue-500' : ''}`}
            onClick={() => setSelectedVersion(version.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">Version {version.id}</h3>
                  <p className="text-sm text-gray-500">{version.changes}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{version.author}</p>
                <p className="text-xs text-gray-500">{version.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
          onClick={() => {/* Logique de comparaison */}}
        >
          <GitCompare className="w-4 h-4" />
          <span>Comparer les versions</span>
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          onClick={() => {/* Logique de restauration */}}
        >
          Restaurer la version sélectionnée
        </button>
      </div>
    </div>
  );
};

export default VersionControl;