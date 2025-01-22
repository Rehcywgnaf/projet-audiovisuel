import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FilterCriteria, useVeille } from '../services/VeilleService';

const DashboardFilters = () => {
  const { filterOpportunities } = useVeille();
  const [filters, setFilters] = useState<FilterCriteria>({
    minMatch: 70,
    type: undefined,
    minBudget: 0,
    maxBudget: undefined
  });

  const handleFilterChange = async (newFilters: Partial<FilterCriteria>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await filterOpportunities(updatedFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Filtres</CardTitle>
      </CardHeader>
      <CardContent>
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
                defaultValue={[70]}
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
                  className="w-full px-3 py-1 border rounded"
                  onChange={(e) => handleFilterChange({ minBudget: Number(e.target.value) })}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
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