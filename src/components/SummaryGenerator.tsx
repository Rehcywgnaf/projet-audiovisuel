import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Eye, Clock, Tags } from 'lucide-react';

const SummaryGenerator = () => {
  const summaryTypes = [
    {
      title: "Résumé Exécutif",
      icon: Eye,
      description: "Synthèse courte des points clés",
      elements: ["Objectif principal", "Budget", "Délais", "Critères clés"]
    },
    {
      title: "Analyse Temporelle",
      icon: Clock,
      description: "Planning et échéances",
      elements: ["Dates importantes", "Durée du projet", "Étapes clés"]
    },
    {
      title: "Catégorisation",
      icon: Tags,
      description: "Classification automatique",
      elements: ["Type (AAP/AO)", "Secteur", "Niveau de priorité"]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Générateur de Résumés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium">{type.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  <ul className="space-y-2">
                    {type.elements.map((element, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryGenerator;