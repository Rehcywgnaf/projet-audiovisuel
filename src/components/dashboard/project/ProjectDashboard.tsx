import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Clock, Brain } from "lucide-react";
import AIServiceManager, { AIInteractionType } from '@/lib/AIServiceManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Document {
  id: number;
  name: string;
  status: 'present' | 'missing' | 'outdated';
  driveLink: string | null;
  deadline: string;
}

interface AIAnalysis {
  recommendations: string;
  riskLevel: 'low' | 'medium' | 'high';
  nextActions: string[];
}

export default function ProjectDashboard() {
  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: 1,
      name: "Formulaire de candidature",
      status: "present",
      driveLink: "https://drive.google.com/...",
      deadline: "2024-02-01"
    },
    {
      id: 2,
      name: "Budget prévisionnel",
      status: "missing",
      driveLink: null,
      deadline: "2024-02-15"
    },
    {
      id: 3,
      name: "Plan d'action",
      status: "outdated",
      driveLink: "https://drive.google.com/...",
      deadline: "2024-02-10"
    },
    {
      id: 4,
      name: "Lettres de soutien",
      status: "present",
      driveLink: "https://drive.google.com/...",
      deadline: "2024-03-01"
    }
  ]);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const analyzeProject = async () => {
      if (!documents.length) return;

      try {
        setIsAnalyzing(true);
        const aiManager = AIServiceManager.getInstance();
        const analysis = await aiManager.generateContent({
          type: AIInteractionType.DEADLINE_ANALYSIS,
          messages: [
            {
              role: 'user',
              content: `Analyze project documents and deadlines, provide recommendations and risk assessment. Documents data: ${JSON.stringify(documents)}`
            }
          ],
          maxTokens: 500,
          temperature: 0.3,
          performanceMetrics: {
            maxResponseTime: 1500,
            priorityLevel: 'HIGH'
          }
        });

        // Parse AI response into structured format
        const parsedAnalysis = {
          recommendations: analysis.content.split('RECOMMENDATIONS:')[1]?.split('RISK_LEVEL:')[0]?.trim() || '',
          riskLevel: analysis.content.includes('HIGH') ? 'high' : 
                    analysis.content.includes('MEDIUM') ? 'medium' : 'low',
          nextActions: analysis.content.split('NEXT_ACTIONS:')[1]?.split('\n').filter(Boolean).map(a => a.trim()) || []
        };

        setAiAnalysis(parsedAnalysis);
      } catch (error) {
        console.warn('AI Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeProject();
  }, [documents]);

  const getStatusIcon = (status: Document['status']) => {
    switch(status) {
      case 'present':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'missing':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'outdated':
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const calculateProgress = () => {
    const complete = documents.filter(doc => doc.status === 'present').length;
    return (complete / documents.length) * 100;
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Suivi des Documents</CardTitle>
          <div className="mt-2">
            <Progress value={calculateProgress()} className="h-2" />
            <p className="text-sm text-gray-500 mt-1">
              {Math.round(calculateProgress())}% complet
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Analysis Section */}
          {aiAnalysis && (
            <Card className="bg-indigo-50 p-4">
              <div className="flex items-center gap-2 mb-4">
                {isAnalyzing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
                ) : (
                  <Brain className="w-5 h-5 text-indigo-600" />
                )}
                <h3 className="font-medium">Analyse IA du Projet</h3>
              </div>
              
              <div className="space-y-4">
                <Alert className="bg-white">
                  <AlertDescription>
                    {aiAnalysis.recommendations}
                  </AlertDescription>
                </Alert>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Niveau de Risque:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    aiAnalysis.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {aiAnalysis.riskLevel.toUpperCase()}
                  </span>
                </div>

                {aiAnalysis.nextActions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Actions Recommandées:</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.nextActions.map((action, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Documents List */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(doc.status)}
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      Échéance: {new Date(doc.deadline).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                {doc.driveLink && (
                  <button 
                    onClick={() => window.open(doc.driveLink, '_blank')}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Voir sur Drive
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}