import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, RefreshCw, Brain, FileText, CheckSquare, ArrowRight } from 'lucide-react';

// Sous-composant : Analyse IA
const AIAnalysis = ({ onAnalysisComplete }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [error, setError] = useState(null);

  const analyzeContent = async (content) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = {
      relevance: Math.floor(Math.random() * 100),
      keywords: ['audiovisuel', 'production', 'financement'],
      category: 'Appel à Projet',
      recommendedActions: [
        'Vérifier les critères d\'éligibilité',
        'Préparer le dossier technique',
        'Établir le budget prévisionnel'
      ],
      confidence: Math.floor(Math.random() * 100)
    };

    onAnalysisComplete(result);
    return result;
  };

  const handleDataProcessing = async (data) => {
    try {
      setProcessingStatus('processing');
      
      const processedData = {
        title: data?.title || 'Sans titre',
        content: data?.content || '',
        timestamp: new Date().toISOString()
      };
      setSummaryData(processedData);
      
      const analysisResult = await analyzeContent(processedData);
      setAiAnalysis(analysisResult);
      
      setProcessingStatus('completed');
      
    } catch (err) {
      setError(err.message);
      setProcessingStatus('error');
    }
  };

  useEffect(() => {
    handleDataProcessing({
      title: "Exemple d'appel à projet",
      content: "Contenu de l'appel à projet..."
    });
  }, []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Analyse IA des Données
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm">
            {processingStatus === 'completed' ? (
              <CheckCircle className="text-green-500 w-4 h-4" />
            ) : processingStatus === 'error' ? (
              <AlertCircle className="text-red-500 w-4 h-4" />
            ) : (
              <RefreshCw className="text-blue-500 w-4 h-4 animate-spin" />
            )}
            <span>
              {processingStatus === 'completed' 
                ? 'Analyse terminée'
                : processingStatus === 'error'
                ? 'Erreur d\'analyse'
                : 'Analyse en cours'}
            </span>
          </div>

          {aiAnalysis && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Résultats de l'Analyse</h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {aiAnalysis.category}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Pertinence</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2" 
                      style={{width: `${aiAnalysis.relevance}%`}}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Confiance</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 rounded-full h-2" 
                      style={{width: `${aiAnalysis.confidence}%`}}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Mots-clés</p>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Actions Recommandées</p>
                <ul className="list-disc pl-4 text-sm space-y-1">
                  {aiAnalysis.recommendedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {error && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Sous-composant : Intégration Templates
const TemplateSection = ({ aiAnalysisResult }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [matchStatus, setMatchStatus] = useState('checking');
  const [templateSuggestions, setTemplateSuggestions] = useState([]);

  const availableTemplates = [
    {
      id: 1,
      name: 'Appel à Projet Audiovisuel',
      type: 'AAP',
      sections: ['Présentation', 'Budget', 'Planning', 'Équipe'],
      requirements: ['audiovisuel', 'production']
    },
    {
      id: 2,
      name: 'Appel d\'Offre Production',
      type: 'AO',
      sections: ['Description Technique', 'Devis', 'Calendrier'],
      requirements: ['production', 'financement']
    }
  ];

  const evaluateTemplateMatch = async () => {
    setMatchStatus('checking');
    
    if (!aiAnalysisResult?.keywords) {
      setMatchStatus('error');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const suggestions = availableTemplates.map(template => {
      const matchingKeywords = template.requirements.filter(req => 
        aiAnalysisResult.keywords.includes(req)
      );

      return {
        ...template,
        matchScore: (matchingKeywords.length / template.requirements.length) * 100
      };
    });

    setTemplateSuggestions(suggestions.sort((a, b) => b.matchScore - a.matchScore));
    setMatchStatus('completed');
  };

  useEffect(() => {
    if (aiAnalysisResult) {
      evaluateTemplateMatch();
    }
  }, [aiAnalysisResult]);

  return (
    <Card className="w-full max-w-4xl mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Suggestion de Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            {matchStatus === 'completed' ? (
              <CheckSquare className="text-green-500 w-4 h-4" />
            ) : matchStatus === 'error' ? (
              <AlertTriangle className="text-red-500 w-4 h-4" />
            ) : (
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent" />
            )}
            <span>
              {matchStatus === 'completed'
                ? 'Templates correspondants trouvés'
                : matchStatus === 'error'
                ? 'Erreur lors de la recherche'
                : 'Recherche des templates...'}
            </span>
          </div>

          {matchStatus === 'completed' && (
            <div className="space-y-4">
              {templateSuggestions.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">Type: {template.type}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {Math.round(template.matchScore)}% match
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {template.sections.map((section, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                    
                    <button 
                      className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                      Utiliser ce template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTemplate && (
            <div className="mt-4 p-4 border-t">
              <h3 className="font-medium mb-2">Template sélectionné : {selectedTemplate.name}</h3>
              <div className="space-y-2">
                {selectedTemplate.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    <span>{section}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Composant principal
const IntegratedWorkflow = () => {
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAiAnalysisResult(result);
  };

  return (
    <div className="space-y-6 p-6">
      <AIAnalysis onAnalysisComplete={handleAnalysisComplete} />
      {aiAnalysisResult && <TemplateSection aiAnalysisResult={aiAnalysisResult} />}
    </div>
  );
};

export default IntegratedWorkflow;
