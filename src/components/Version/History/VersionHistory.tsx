import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History, GitCommit, RotateCcw, Clock } from 'lucide-react';

const VersionHistory = () => {
  const [changes] = useState([
    {
      id: 'v1',
      title: 'Version initiale',
      description: 'Création du document',
      timestamp: '2025-01-06T10:00:00.000Z',
      author: 'Système',
      type: 'initial'
    },
    {
      id: 'v2',
      title: 'Mise à jour structure',
      description: 'Modification de la structure du document',
      timestamp: '2025-01-06T11:30:00.000Z',
      author: 'Marie Martin',
      type: 'major'
    },
    {
      id: 'v3',
      title: 'Correction contenu',
      description: 'Corrections mineures du contenu',
      timestamp: '2025-01-06T14:15:00.000Z',
      author: 'Jean Dupont',
      type: 'minor'
    }
  ]);

  const [selectedVersion, setSelectedVersion] = useState(null);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique des Modifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative space-y-2">
            {changes.map((change, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-3 rounded-lg border ${
                  selectedVersion === change.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedVersion(change.id)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <GitCommit className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{change.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(change.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{change.description}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {change.author}
                    </span>
                    {change.type && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        change.type === 'major' ? 'bg-red-100 text-red-700' :
                        change.type === 'minor' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {change.type}
                      </span>
                    )}
                  </div>
                </div>

                {selectedVersion === change.id && (
                  <button 
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Rollback to version:', change.id);
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restaurer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionHistory;
