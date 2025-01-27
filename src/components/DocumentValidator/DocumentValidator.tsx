import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

const DocumentValidator = () => {
  const [validationState, setValidationState] = useState({
    fileFormat: false,
    fileSize: false,
    content: false,
    metadata: false,
  });

  const [errors, setErrors] = useState([]);

  const validationRules = {
    acceptedFormats: ['doc', 'docx', 'pdf', 'odt'],
    maxSize: 10 * 1024 * 1024, // 10MB
    requiredMetadata: ['title', 'author', 'project', 'version'],
    contentRules: ['minLength', 'hasStructure', 'validEncoding']
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="w-6 h-6" />
          Validation des Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(validationState).map(([key, isValid]) => (
              <div key={key} className="flex items-center gap-2 p-2 border rounded">
                {isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </div>
            ))}
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle>Erreurs de validation</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentValidator;