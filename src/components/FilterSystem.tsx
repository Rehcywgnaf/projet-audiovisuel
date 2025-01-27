import React from 'react';
import { Tag, X } from 'lucide-react';

type Filter = {
  type: 'tag' | 'budget' | 'status' | 'date';
  value: string;
};

export default function FilterSystem() {
  const [filters, setFilters] = React.useState<Filter[]>([]);
  const [tags, setTags] = React.useState(['Documentaire', 'Court-métrage', 'Animation']);
  const [budgetRanges] = React.useState([
    '0-50k€', '50k-100k€', '100k-200k€', '+200k€'
  ]);

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <span 
            key={index}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
          >
            {filter.type}: {filter.value}
            <button 
              onClick={() => removeFilter(index)}
              className="hover:bg-blue-200 rounded-full p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilters([...filters, { type: 'tag', value: tag }])}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Budget</h3>
          <div className="flex flex-wrap gap-2">
            {budgetRanges.map(range => (
              <button
                key={range}
                onClick={() => setFilters([...filters, { type: 'budget', value: range }])}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Statut</h3>
          <div className="flex flex-wrap gap-2">
            {['En cours', 'À venir', 'Terminé'].map(status => (
              <button
                key={status}
                onClick={() => setFilters([...filters, { type: 'status', value: status }])}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}