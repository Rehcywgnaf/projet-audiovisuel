import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { rssProjectService } from '@/services/RSSProjectService';

type RSSSource = {
  id: number;
  url: string;
  type: 'rss' | 'scraping' | 'api';
  status: 'active' | 'pending' | 'error';
  lastCheck: Date | null;
  analysis?: {
    score: number;
    category: string;
    keywords: string[];
    lastAnalysis: Date;
  };
};

const RSSManager: React.FC = () => {
  const [sources, setSources] = useState<RSSSource[]>([]);
  const [newSource, setNewSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial des sources
  useEffect(() => {
    setSources(rssProjectService.getSources());
  }, []);

  const addSource = async (): Promise<void> => {
    if (!newSource) return;

    try {
      setIsLoading(true);
      setError(null);

      const newSourceData = await rssProjectService.addSource(newSource);
      setSources(rssProjectService.getSources());
      setNewSource('');

    } catch (error) {
      setError('Erreur lors de l\'ajout de la source');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSource = (id: number): void => {
    try {
      rssProjectService.removeSource(id);
      setSources(rssProjectService.getSources());
    } catch (error) {
      setError('Erreur lors de la suppression de la source');
      console.error('Erreur:', error);
    }
  };

  const updateSourceAnalysis = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      await rssProjectService.updateAnalysis(id);
      setSources(rssProjectService.getSources());
    } catch (error) {
      setError('Erreur lors de la mise à jour de l\'analyse');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Sources de Veille</h2>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="URL du flux RSS"
            className="px-3 py-2 border rounded"
            disabled={isLoading}
          />
          <button 
            onClick={addSource}
            disabled={isLoading || !newSource}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Ajouter
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {sources.map(source => (
            <div key={source.id} className="flex items-center justify-between p-4 border rounded hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {source.status === 'active' ? (
                    <RefreshCw 
                      className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-600" 
                      onClick={() => updateSourceAnalysis(source.id)}
                    />
                  ) : source.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${source.type === 'rss' ? 'bg-blue-100 text-blue-800' : source.type === 'api' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {source.type}
                  </span>
                </div>
                <span className="text-sm flex-1">{source.url}</span>
                {source.analysis && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                      Score: {source.analysis.score}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {source.analysis.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {source.lastCheck ? `Dernière vérification: ${source.lastCheck.toLocaleString()}` : 'En attente'}
                </span>
                <button 
                  onClick={() => removeSource(source.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
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