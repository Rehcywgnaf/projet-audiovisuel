import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, FileText, Users, AlertCircle } from 'lucide-react';

const IntegrationDrive = () => {
  const [documents, setDocuments] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [erreur, setErreur] = useState(null);

  const gererChangementPermissions = async (docId, nouveauRole) => {
    try {
      console.log(`Permission mise à jour pour ${docId}: ${nouveauRole}`);
    } catch (err) {
      setErreur('Erreur de modification des permissions');
    }
  };

  const ListeDocuments = ({ docs }) => (
    <div className="space-y-4">
      {docs.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">{doc.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm">{doc.deadline}</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (erreur) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{erreur}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents Drive</CardTitle>
        </CardHeader>
        <CardContent>
          <ListeDocuments docs={documents} />
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationDrive;