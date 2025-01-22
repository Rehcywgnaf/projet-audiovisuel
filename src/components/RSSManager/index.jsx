import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

const RSSManager = () => {
  const [sources, setSources] = useState([
    { id: 1, url: 'https://cnc.fr/feed', type: 'rss', status: 'active', lastCheck: new Date() },
    { id: 2, url: 'https://www.francemarches.com/appels-offres-audiovisuel', type: 'scraping', status: 'active', lastCheck: new Date() },
    { id: 3, url: 'https://www.e-marchespublics.com', type: 'api', status: 'pending', lastCheck: null },
    { id: 4, url: 'https://appelaprojets.org', type: 'scraping', status: 'active', lastCheck: new Date() },
    { id: 5, url: 'https://www.marchesonline.com', type: 'api', status: 'active', lastCheck: new Date() },
    { id: 6, url: 'https://www.fimeco-walter-allinial.com', type: 'scraping', status: 'pending', lastCheck: null },
    { id: 7, url: 'https://www.cap-metiers.pro', type: 'rss', status: 'active', lastCheck: new Date() },
    { id: 8, url: 'https://ellesfontlaculture.culture.gouv.fr', type: 'scraping', status: 'active', lastCheck: new Date() }
  ]);

  const [newSource, setNewSource] = useState('');

  const addSource = () => {
    if (!newSource) return;
    setSources([...sources, {
      id: Date.now(),
      url: newSource,
      status: 'pending',
      lastCheck: null
    }]);
    setNewSource('');
  };

  const removeSource = (id) => {
    setSources(sources.filter(source => source.id !== id));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">Sources de Veille</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="URL du flux RSS"
            className="px-3 py-2 border rounded"
          />
          <button 
            onClick={addSource}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.map(source => (
            <div key={source.id} className="flex items-center justify-between p-4 border rounded">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {source.status === 'active' ? (
                    <RefreshCw className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="px-2 py-1 text-xs rounded bg-gray-100">
                    {source.type}
                  </span>
                </div>
                <span>{source.url}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {source.lastCheck ? `Dernière vérification: ${source.lastCheck.toLocaleString()}` : 'En attente'}
                </span>
                <button 
                  onClick={() => removeSource(source.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RSSManager;