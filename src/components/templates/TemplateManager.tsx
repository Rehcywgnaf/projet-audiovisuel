import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Brain, RefreshCcw } from 'lucide-react';
import withPermissions from '@/components/drive/permissions/TemplatePermissionsWrapper';

const TemplateManager = ({ permissions }) => {
  const [aiFeatures] = useState([
    {
      phase: "Phase 1",
      features: [
        "Analyse mots-clés",
        "Catégorisation AAP/AO", 
        "Extraction deadlines",
        "Résumés automatiques"
      ],
      status: permissions.canWrite ? "À implémenter" : "Accès restreint"
    },
    {
      phase: "Phase 2",
      features: [
        "Scoring avancé des projets",
        "Suggestions de réponses personnalisées",
        "Analyse prédictive des chances de succès"
      ],
      status: permissions.canWrite ? "Future mise à jour" : "Accès restreint"
    }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Gestionnaire de Templates
            {permissions.canManage && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Admin
              </span>
            )}
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

            {permissions.canWrite && (
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
            )}
          </div>

          {!permissions.canWrite && (
            <Alert className="mt-4">
              <AlertDescription>
                Mode lecture seule. Contactez un administrateur pour plus de droits.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default withPermissions(TemplateManager);