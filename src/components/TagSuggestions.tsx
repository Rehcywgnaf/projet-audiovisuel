import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

type SuggestedTag = {
  tag: string;
  frequency: number;
  lastSeen: string;
};

export default function TagSuggestions() {
  const [suggestedTags, setSuggestedTags] = React.useState<SuggestedTag[]>([
    { tag: 'Transmedia', frequency: 4, lastSeen: '2024-12-30' },
    { tag: 'Réalité virtuelle', frequency: 5, lastSeen: '2024-12-29' }
  ]);

  const addTag = (tag: string) => {
    setSuggestedTags(prev => prev.filter(t => t.tag !== tag));
    // TODO: Ajouter aux tags connus
  };

  const ignoreTag = (tag: string) => {
    setSuggestedTags(prev => prev.filter(t => t.tag !== tag));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Suggestions de tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suggestedTags.map(({ tag, frequency }) => (
            <div key={tag} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{tag}</span>
                <span className="ml-2 text-sm text-gray-500">
                  Vu {frequency} fois
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addTag(tag)}
                  className="p-1 hover:bg-green-100 rounded-full text-green-600"
                  title="Ajouter ce tag"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => ignoreTag(tag)}
                  className="p-1 hover:bg-red-100 rounded-full text-red-600"
                  title="Ignorer ce tag"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}