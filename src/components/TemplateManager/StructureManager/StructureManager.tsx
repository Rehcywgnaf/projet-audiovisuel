import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TemplateStructure, TemplateSectionDefinition } from '../types';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  structure: TemplateStructure;
  onValidation?: (isValid: boolean) => void;
}

export const StructureManager: React.FC<Props> = ({ structure, onValidation }) => {
  const validateSection = (section: TemplateSectionDefinition, content?: string) => {
    if (!section.required && !content) return true;
    if (section.required && !content) return false;
    
    if (content) {
      const wordCount = content.trim().split(/\s+/).length;
      if (section.minWords && wordCount < section.minWords) return false;
      if (section.maxWords && wordCount > section.maxWords) return false;
    }
    
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Structure du Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {structure.sections.map((section) => (
          <div 
            key={section.id}
            className="flex items-start justify-between border-b pb-2"
          >
            <div>
              <h3 className="font-medium flex items-center gap-2">
                {section.title}
                {section.required && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    Requis
                  </span>
                )}
              </h3>
              {(section.minWords || section.maxWords) && (
                <p className="text-sm text-gray-500">
                  {section.minWords && `Min: ${section.minWords} mots`}
                  {section.minWords && section.maxWords && ' | '}
                  {section.maxWords && `Max: ${section.maxWords} mots`}
                </p>
              )}
            </div>
            <div className="flex items-center">
              {validateSection(section) ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          </div>
        ))}

        {structure.requiredFields.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Champs Obligatoires</h3>
            <div className="space-y-2">
              {structure.requiredFields.map((field) => (
                <div 
                  key={field.id} 
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{field.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {field.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StructureManager;