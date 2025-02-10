import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Filter, Bell, Settings, 
  ThumbsUp, ThumbsDown, ExternalLink, 
  Sliders 
} from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  type: 'AAP' | 'AO';
  date: string;
  summary: {
    exec: string;
    budget: string;
    deadline: string;
    keywords: string[];
  };
  detailed_summary: string;
  originalUrl: string;
  aiSuggestions?: string;
  priority: 'high' | 'medium' | 'low';
}

const OpportunityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    types: ['AAP', 'AO'],
    minBudget: 0,
    maxBudget: Infinity,
    keywords: [] as string[]
  });

  const opportunities: Opportunity[] = [
    {
      id: 1,
      title: "Innovation Audiovisuelle 2024",
      type: "AAP",
      date: "2024-02-15",
      summary: {
        exec: "Financement de projets innovants",
        budget: "50k€ - 150k€",
        deadline: "15 Mars 2024",
        keywords: ["innovation", "audiovisuel", "digital"]
      },
      detailed_summary: "Programme de soutien aux projets innovants dans l'audiovisuel, axé sur la transformation digitale et les nouvelles formes de narration.",
      originalUrl: "https://example.com/opportunity/1",
      aiSuggestions: "Ce projet correspond à votre expertise en production innovante.",
      priority: "high"
    }
    // Autres opportunités...
  ];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => 
      filters.types.includes(opp.type) &&
      parseFloat(opp.summary.budget.replace('k€', '')) >= filters.minBudget &&
      parseFloat(opp.summary.budget.replace('k€', '')) <= filters.maxBudget &&
      (filters.keywords.length === 0 || 
       filters.keywords.some(kw => 
         opp.summary.keywords.map(k => k.toLowerCase()).includes(kw.toLowerCase())
       ))
    );
  }, [opportunities, filters]);

  const openOriginalSource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Filtres et Navigation */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button 
            variant={activeTab === 'recent' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('recent')}
          >
            Récents
          </Button>
          <Button 
            variant={activeTab === 'saved' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('saved')}
          >
            Sauvegardés
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Liste des Opportunités */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => (
          <Card key={opp.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      opp.type === 'AAP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {opp.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      opp.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {opp.priority === 'high' ? 'Prioritaire' : 'Standard'}
                    </span>
                  </div>
                  <h3 className="font-medium">{opp.title}</h3>
                </div>
                <div className="text-sm text-gray-500">{opp.date}</div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Résumé: </span>
                    {opp.summary.exec}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Budget: </span>
                    {opp.summary.budget}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Deadline: </span>
                  <span className="text-red-600 font-medium">{opp.summary.deadline}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {opp.summary.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" /> Utile
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="w-4 h-4 mr-1" /> Pas Utile
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openOriginalSource(opp.originalUrl)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> Voir l'original
                  </Button>
                </div>
                <Button 
                  variant="link"
                  onClick={() => setExpandedId(opp.id === expandedId ? null : opp.id)}
                >
                  {opp.id === expandedId ? 'Réduire' : 'Détails'}
                </Button>
              </div>

              {expandedId === opp.id && (
                <div className="mt-4 pt-4 border-t bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Résumé Détaillé</h4>
                  <p className="text-gray-700 mb-4">{opp.detailed_summary}</p>
                  
                  {opp.aiSuggestions && (
                    <div className="bg-blue-50 rounded p-3 text-sm text-blue-700 mb-4">
                      <strong>Suggestions IA :</strong> {opp.aiSuggestions}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OpportunityDashboard;
