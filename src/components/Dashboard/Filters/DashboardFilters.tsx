import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { FilterCriteria, useVeille } from '../../../services/VeilleService';
import { useAI } from '@/hooks/useAI';

const DashboardFilters = () => {
  const { filterOpportunities } = useVeille();
  const { execute, result, isLoading } = useAI('rss-filtering');
  
  const [filters, setFilters] = useState<FilterCriteria>({
    minMatch: 70,
    type: undefined,
    minBudget: 0,
    maxBudget: undefined
  });

  const [aiSuggestions, setAISuggestions] = useState<any>(null);

  const handleFilterChange = async (newFilters: Partial<FilterCriteria>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await filterOpportunities(updatedFilters);
  };

  const handleAISuggestions = async () => {
    await execute('suggest-filters', {
      complexity: 'simple',
      cache: true
    });
  };

  useEffect(() => {
    if (result?.data) {
      setAISuggestions(result.data);
      // Appliquer automatiquement certaines suggestions si pertinentes
      if (result.data.suggestedMinMatch) {
        handleFilterChange({ minMatch: result.data.suggestedMinMatch });
      }
      if (result.data.suggestedTypes) {
        handleFilterChange({ type: result.data.suggestedTypes[0] });
      }
    }
  }, [result]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">Filtres</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAISuggestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Lightbulb className="w-4 h-4 mr-2" />
          )}
          Suggestions IA
        </Button>
      </CardHeader>
      <CardContent>
        {aiSuggestions && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
              Suggestions IA
            </h3>
            <div className="text-sm text-gray-700">
              {aiSuggestions.reasoning && (
                <p className="mb-2">{aiSuggestions.reasoning}</p>
              )}
              {aiSuggestions.suggestedTypes && (
                <div className="mb-2">
                  <strong>Types recommandés :</strong> 
                  {aiSuggestions.suggestedTypes.join(", ")}
                </div>
              )}
              {aiSuggestions.suggestedMinMatch && (
                <div>
                  <strong>Score minimal recommandé :</strong> 
                  {aiSuggestions.suggestedMinMatch}%
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Type de projet</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleFilterChange({ type: 'AAP' })}
                className={`px-4 py-2 rounded-lg border ${
                  filters.type === 'AAP' ? 'bg-blue-100 border-blue-500' : ''
                }`}
              >
                AAP
              </button>
              <button
                onClick={() => handleFilterChange({ type: 'AO' })}
                className={`px-4 py-2 rounded-lg border ${
                  filters.type === 'AO' ? 'bg-green-100 border-green-500' : ''
                }`}
              >
                AO
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Score minimum</label>
            <div className="mt-2">
              <Slider
                value={[filters.minMatch]}
                max={100}
                step={5}
                onValueChange={(value) => handleFilterChange({ minMatch: value[0] })}
              />
              <div className="text-xs text-right mt-1">
                {filters.minMatch}% minimum
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Budget (k€)</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minBudget || ''}
                  className="w-full px-3 py-1 border rounded"
                  onChange={(e) => handleFilterChange({ minBudget: Number(e.target.value) })}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxBudget || ''}
                  className="w-full px-3 py-1 border rounded"
                  onChange={(e) => handleFilterChange({ maxBudget: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;