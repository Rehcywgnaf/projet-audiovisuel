import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DocumentGenerator = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    companyInfo: {
      name: '',
      address: '',
      registration: '',
      legalRep: '',
      projectManager: ''
    },
    projectDetails: {
      summary: '',
      objectives: '',
      timeline: '',
      budget: ''
    }
  });

  const templates = {
    artistic: {
      title: "Dossier artistique",
      sections: ['Synopsis', 'Note d\'intention', 'Traitement']
    },
    technical: {
      title: "Dossier technique",
      sections: ['Équipe', 'Planning', 'Moyens techniques']
    },
    financial: {
      title: "Dossier financier",
      sections: ['Budget', 'Plan de financement', 'Devis']
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generateDocument = (template) => {
    // Logique de génération à implémenter
    console.log(`Generating ${template.title}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="company">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="company">Informations société</TabsTrigger>
              <TabsTrigger value="project">Détails projet</TabsTrigger>
              <TabsTrigger value="generate">Génération</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-4">
              <Input
                placeholder="Nom de la société"
                value={formData.companyInfo.name}
                onChange={(e) => handleInputChange('companyInfo', 'name', e.target.value)}
              />
              <Input
                placeholder="Adresse"
                value={formData.companyInfo.address}
                onChange={(e) => handleInputChange('companyInfo', 'address', e.target.value)}
              />
              <Input
                placeholder="SIRET"
                value={formData.companyInfo.registration}
                onChange={(e) => handleInputChange('companyInfo', 'registration', e.target.value)}
              />
              <Input
                placeholder="Représentant légal"
                value={formData.companyInfo.legalRep}
                onChange={(e) => handleInputChange('companyInfo', 'legalRep', e.target.value)}
              />
              <Input
                placeholder="Responsable du projet"
                value={formData.companyInfo.projectManager}
                onChange={(e) => handleInputChange('companyInfo', 'projectManager', e.target.value)}
              />
            </TabsContent>

            <TabsContent value="project" className="space-y-4">
              <Input
                placeholder="Nom du projet"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              />
              <Textarea
                placeholder="Résumé du projet"
                value={formData.projectDetails.summary}
                onChange={(e) => handleInputChange('projectDetails', 'summary', e.target.value)}
              />
              <Textarea
                placeholder="Objectifs"
                value={formData.projectDetails.objectives}
                onChange={(e) => handleInputChange('projectDetails', 'objectives', e.target.value)}
              />
              <Input
                placeholder="Timeline"
                value={formData.projectDetails.timeline}
                onChange={(e) => handleInputChange('projectDetails', 'timeline', e.target.value)}
              />
              <Input
                placeholder="Budget estimé"
                value={formData.projectDetails.budget}
                onChange={(e) => handleInputChange('projectDetails', 'budget', e.target.value)}
              />
            </TabsContent>

            <TabsContent value="generate" className="grid grid-cols-2 gap-4">
              {Object.values(templates).map(template => (
                <Card key={template.title} className="p-4">
                  <CardTitle className="text-lg mb-2">{template.title}</CardTitle>
                  <ul className="list-disc pl-4 mb-4">
                    {template.sections.map(section => (
                      <li key={section} className="text-sm text-gray-600">{section}</li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => generateDocument(template)}
                    className="w-full"
                  >
                    Générer
                  </Button>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentGenerator;