import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Filter, Bell, Settings, 
  ThumbsUp, ThumbsDown, ExternalLink, 
  FileText, Calendar 
} from 'lucide-react';
import { useRSS } from '@/hooks/useRSS';

const OpportunitiesView: React.FC = () => {
  const { rssData, isLoading, error } = useRSS();
  const [activeFilter, setActiveFilter] = useState<'all' | 'aap' | 'ao'>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  
  // Vérification que rssData.recent est bien défini avant d'appliquer le filtre
  const filteredOpportunities = useMemo(() => {
    if (!rssData || !rssData.recent) return [];
    return rssData.recent.filter(opp => 
      activeFilter === 'all' || opp.type.toLowerCase() === activeFilter
    );
  }, [rssData, activeFilter]);

  const renderOpportunityDetails = (opp: any) => {
    if (!opp) return null;

    return (
      <Card className="w-full">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{opp.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  opp.type === 'AAP' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {opp.type}
                </span>
                <span className="text-sm text-gray-500">
                  Publié le {new Date(opp.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(opp.link, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Voir l'original
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
            onClick={() => setActiveFilter('all')}
          >
            Toutes les opportunités
          </Button>
          <Button 
            variant={activeFilter === 'aap' ? 'secondary' : 'ghost'}
            onClick={() => setActiveFilter('aap')}
          >
            AAP
          </Button>
          <Button 
            variant={activeFilter === 'ao' ? 'secondary' : 'ghost'}
            onClick={() => setActiveFilter('ao')}
          >
            AO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          {filteredOpportunities.map((opp) => (
            <Card 
              key={opp.id} 
              className={`cursor-pointer ${
                selectedOpportunity?.id === opp.id 
                  ? 'border-blue-500 shadow-md' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedOpportunity(opp)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{opp.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        opp.type === 'AAP' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {opp.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline-block mr-1" />
                        {new Date(opp.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="col-span-2">
          {selectedOpportunity 
            ? renderOpportunityDetails(selectedOpportunity)
            : (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <p className="text-gray-500">Sélectionnez une opportunité pour voir les détails</p>
                </CardContent>
              </Card>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesView;
