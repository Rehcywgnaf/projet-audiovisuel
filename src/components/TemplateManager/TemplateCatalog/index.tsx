import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Template } from '../types';

interface Props {
  templates: Template[];
  onSelect: (template: Template) => void;
}

export const TemplateCatalog: React.FC<Props> = ({ templates, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card 
          key={template.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(template)}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{template.name}</span>
              <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">
                {template.type}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Sections requises : {
                  template.structure.sections
                    .filter(s => s.required)
                    .length
                }
              </div>
              <div className="flex flex-wrap gap-1">
                {template.metadata.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="text-xs px-2 py-1 rounded bg-gray-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};