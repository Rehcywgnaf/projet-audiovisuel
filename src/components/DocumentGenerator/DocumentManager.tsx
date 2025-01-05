import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  FileText, Brain, Settings, Eye, 
  MessageSquare, Download, RefreshCw 
} from 'lucide-react';

const DocumentManager = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [document, setDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const tabs = [
    { id: 'generate', label: 'Générer/Éditer', icon: FileText },
    { id: 'customize', label: 'Personnaliser', icon: Settings },
    { id: 'preview', label: 'Aperçu', icon: Eye },
    { id: 'feedback', label: 'Retours', icon: MessageSquare },
    { id: 'export', label: 'Exporter', icon: Download }
  ];

  const generatedContent = {
    title: "Réponse Innovation Documentaire 2025",
    sections: [
      {
        id: "vision",
        title: "Vision & Concept",
        content: "Notre projet innovant combine les dernières technologies de captation avec une approche narrative moderne...",
        status: "ai-generated"
      },
      {
        id: "technical",
        title: "Approche Technique",
        content: "Utilisation de caméras 8K et drones pour une immersion totale...",
        status: "ai-generated"
      }
    ]
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDocument(generatedContent);
      setIsGenerating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {isGenerating ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <h2 className="text-xl font-semibold">Génération du Document</h2>
              <p className="text-gray-600">Analyse de l'appel et création du contenu...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {document?.sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {section.title}
                    {section.status === 'ai-generated' && (
                      <Brain className="w-4 h-4 text-blue-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-48 p-3 border rounded-lg resize-none"
                    defaultValue={section.content}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-medium">Assistant IA</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;