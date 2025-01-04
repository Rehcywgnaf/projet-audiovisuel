import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Brain, FileText, RefreshCcw, Database } from 'lucide-react';

const TemplateManager = () => {
  const aiFeatures = [
    {
      phase: "Phase 1",
      features: [
        "Analyse mots-clés",
        "Catégorisation AAP/AO", 
        "Extraction deadlines",
        "Résumés automatiques"
      ],
      status: "À implémenter"
    },
    {
      phase: "Phase 2",
      features: [
        "Scoring avancé des projets",
        "Suggestions de réponses personnalisées",
        "Analyse prédictive des chances de succès"
      ],
      status: "Future mise à jour"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Gestionnaire de Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium flex items-center gap-2 mb-4">
                <RefreshCcw className="w-4 h-4" />
                Flux de Données
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded">Veille RSS</div>
                <div className="text-center">↓</div>
                <div className="p-2 bg-green-50 rounded">Analyse & Catégorisation</div>
                <div className="text-center">↓</div>
                <div className="p-2 bg-purple-50 rounded">Génération Template</div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4" />
                Fonctionnalités IA
              </h3>
              <div className="space-y-4">
                {aiFeatures.map((phase, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-sm">{phase.phase}</h4>
                    <ul className="space-y-1 text-sm">
                      {phase.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-gray-500">{phase.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateManager;