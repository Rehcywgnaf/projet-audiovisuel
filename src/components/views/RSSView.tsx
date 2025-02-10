import React from 'react';
import { 
  Activity,
  RefreshCcw,
  FileText,
  Tag,
  ExternalLink, 
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRSS } from '@/hooks/useRSS';

const RSSView = () => {
  const { rssData, isLoading, error } = useRSS();

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center">
      <Activity className="h-8 w-8 animate-spin text-blue-600" />
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      {error}
    </div>;
  }

  if (!rssData) return null;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Sources Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rssData.stats.totalActive}</div>
            <div className="text-xs text-gray-500">
              {rssData.stats.totalError} en erreur
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              AAP Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rssData.aap.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              AO Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rssData.ao.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Opportunités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rssData.recent.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunités Récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5" />
            Dernières Opportunités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rssData.recent.map((opp) => (
              <div key={opp.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{opp.title}</h3>
                      <span 
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          opp.type === 'AAP' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {opp.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Publié le {new Date(opp.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {opp.analysis && (
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {opp.analysis.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {opp.analysis.category}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        Score: {opp.analysis.score}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* État des Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sources RSS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rssData.sources.map((source) => (
              <div 
                key={source.id}
                className="p-2 flex items-center justify-between hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {source.status === 'error' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : source.status === 'pending' ? (
                    <Activity className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  )}
                  <span className="font-medium">{source.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Dernière sync: {new Date(source.lastSync).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSSView;