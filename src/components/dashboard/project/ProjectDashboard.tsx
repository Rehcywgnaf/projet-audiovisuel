import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface Document {
  id: number;
  name: string;
  status: 'present' | 'missing' | 'outdated';
  driveLink: string | null;
  deadline: string;
}

export default function ProjectDashboard() {
  const [documents] = useState<Document[]>([
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Suivi des Documents</CardTitle>
        <div className="mt-2">
          <Progress value={calculateProgress()} className="h-2" />
          <p className="text-sm text-gray-500 mt-1">
            {Math.round(calculateProgress())}% complet
          </p>
        </div>
      </CardHeader>
      <CardContent>
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
  );
}