import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const CriteriaExtractor = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      summary: {
        issuer: "CNC",
        projectType: "Production audiovisuelle",
        context: "Soutien à la création documentaire",
        eligibleCandidates: ["Sociétés de production", "Associations audiovisuelles"],
        keyPoints: [
          "Focus sur les sujets innovants",
          "Dimension internationale possible",
          "Diffusion TV ou plateforme requise"
        ]
      },
      id: 1,
      title: "Appel à projets audiovisuels 2024",
      eligibility: [
        "Production basée en France",
        "Budget minimum 50k€",
        "Format documentaire ou fiction"
      ],
      documents: [
        "Dossier artistique",
        "Budget prévisionnel",
        "Plan de financement",
        "CV de l'équipe"
      ],
      deadlines: [
        {
          date: "2024-03-15",
          description: "Dépôt du dossier"
        },
        {
          date: "2024-04-30",
          description: "Présentation orale"
        }
      ],
      funding: {
        max: 200000,
        percentage: 40,
        notes: "Aide sélective, remboursable sur recettes"
      }
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Critères des Appels à Projets</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="eligibility" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="eligibility">Éligibilité</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="funding">Financement</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Émetteur</h3>
                <p>{projects[0].summary.issuer}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Nature du projet</h3>
                <p>{projects[0].summary.projectType}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Contexte</h3>
                <p>{projects[0].summary.context}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Qui peut émarger</h3>
                <ul className="list-disc pl-4">
                  {projects[0].summary.eligibleCandidates.map((candidate, index) => (
                    <li key={index}>{candidate}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Points clés</h3>
                <ul className="list-disc pl-4">
                  {projects[0].summary.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eligibility">
            <ul className="space-y-2">
              {projects[0].eligibility.map((criterion, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="documents">
            <ul className="space-y-2">
              {projects[0].documents.map((doc, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="deadlines">
            <div className="space-y-4">
              {projects[0].deadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{deadline.description}</span>
                  <Badge>
                    {new Date(deadline.date).toLocaleDateString('fr-FR')}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="funding">
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Montant maximum</span>
                <Badge variant="outline">{projects[0].funding.max.toLocaleString()}€</Badge>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Pourcentage du budget</span>
                <Badge variant="outline">{projects[0].funding.percentage}%</Badge>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{projects[0].funding.notes}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CriteriaExtractor;