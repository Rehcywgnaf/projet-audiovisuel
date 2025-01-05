import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Brain, FileText, RefreshCcw, Database } from 'lucide-react';

const TemplateManager = () => {
  const aiFeatures = [
    {
      source: "Analyse AO/AAP",
      features: [
        {
          name: "Mots-clés critiques",
          description: "Extraction des critères d'évaluation et points clés",
          suggestion: "Insister sur l'expérience en 'documentaire nature'"
        },
        {
          name: "Budget cible",
          description: "Analyse des fourchettes budgétaires acceptables",
          suggestion: "Budget type : 150-200K€"
        }
      ]
    },
    {
      source: "Profil Entreprise",
      features: [
        {
          name: "Points forts",
          description: "Analyse des atouts différenciants",
          suggestion: "Mettre en avant les 3 récompenses festivals"
        },
        {
          name: "Expérience pertinente",
          description: "Sélection des références similaires",
          suggestion: "Série documentaire 'Océans' comme référence clé"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Gestionnaire de Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Contenu existant */}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateManager;