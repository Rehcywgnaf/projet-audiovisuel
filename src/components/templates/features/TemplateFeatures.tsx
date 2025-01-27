import React from 'react';
import { Brain } from 'lucide-react';

interface Feature {
  name: string;
  status: string;
}

interface Phase {
  name: string;
  features: Feature[];
}

interface TemplateFeaturesProps {
  phases: Phase[];
  canAccess?: boolean;
}

const TemplateFeatures = ({ phases, canAccess = true }: TemplateFeaturesProps) => {
  if (!canAccess) return null;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4" />
        Fonctionnalités IA
      </h3>
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={index} className="space-y-2">
            <h4 className="font-medium text-sm">{phase.name}</h4>
            <ul className="space-y-1 text-sm">
              {phase.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>{feature.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {feature.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateFeatures;