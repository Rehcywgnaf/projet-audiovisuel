import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import AIServiceManager from '@/lib/AIServiceManager';

interface RSSSource {
  id: number;
  url: string;
  type: 'rss' | 'scraping' | 'api';
  status: 'active' | 'pending' | 'error';
  lastCheck: Date | null;
  lastAnalysis?: {
    score: number;
    category: string;
    keywords: string[];
  };
}

const RSSManager: React.FC = () => {
  const [sources, setSources] = useState<RSSSource[]>([
    { id: 1, url: 'https://cnc.fr/feed', type: 'rss', status: 'active', lastCheck: new Date() },
    { id: 2, url: 'https://www.francemarches.com/appels-offres-audiovisuel', type: 'scraping', status: 'active', lastCheck: new Date() },
    { id: 3, url: 'https://www.e-marchespublics.com', type: 'api', status: 'pending', lastCheck: null },
    { id: 4, url: 'https://appelaprojets.org', type: 'scraping', status: 'active', lastCheck: new Date() },
    { id: 5, url: 'https://www.marchesonline.com', type: 'api', status: 'active', lastCheck: new Date() },
    { id: 6, url: 'https://www.fimeco-walter-allinial.com', type: 'scraping', status: 'pending', lastCheck: null },
    { id: 7, url: 'https://www.cap-metiers.pro', type: 'rss', status: 'active', lastCheck: new Date() },
    { id: 8, url: 'https://ellesfontlaculture.culture.gouv.fr', type: 'scraping', status: 'active', lastCheck: new Date() }
  ]);

  const [newSource, setNewSource] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const aiManager = AIServiceManager.getInstance();

  const analyzeSource = async (url: string): Promise<void> => {
    try {
      setIsAnalyzing(true);
      const response = await aiManager.processRequest('rss-analyzer', 'analyze', {
        data: { url },
        options: {
          priority: 'high',
          cache: true
        }
      });

      if (response.success && response.data) {
        // TODO: Mise à jour de l'analyse
        console.log('Analyse réussie:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addSource = async (): Promise<void> => {
    if (!newSource) return;

    const newSourceData: RSSSource = {
      id: Date.now(),
      url: newSource,
      type: determineSourceType(newSource),
      status: 'pending',
      lastCheck: null
    };

    setSources(prev => [...prev, newSourceData]);
    setNewSource('');

    // Analyse de la nouvelle source
    await analyzeSource(newSource);
  };

  const determineSourceType = (url: string): RSSSource['type'] => {
    if (url.includes('feed') || url.includes('rss')) return 'rss';
    if (url.includes('api')) return 'api';
    return 'scraping';
  };

  const removeSource = (id: number): void => {
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
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
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
            <div key={source.id} className="flex items-center justify-between p-4 border rounded hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {source.status === 'active' ? (
                    <RefreshCw className="w-5 h-5 text-green-500" />
                  ) : source.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${source.type === 'rss' ? 'bg-blue-100 text-blue-800' : source.type === 'api' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {source.type}
                  </span>
                </div>
                <span className="text-sm">{source.url}</span>
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