import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, RefreshCcw } from 'lucide-react';

interface TemplateUIProps {
  title?: string;
  isAdmin?: boolean;
  children?: React.ReactNode;
}

const TemplateUI = ({ 
  title = "Gestionnaire de Templates",
  isAdmin = false,
  children 
}: TemplateUIProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {title}
            {isAdmin && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Admin
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium flex items-center gap-2 mb-4">
                <RefreshCcw className="w-4 h-4" />
                Flux de Données
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded">Veille RSS</div>
                <div className="text-center">↓</div>
                <div className="p-2 bg-green-50 rounded">Analyse & Catégorisation</div>
                <div className="text-center">↓</div>
                <div className="p-2 bg-purple-50 rounded">Génération Template</div>
              </div>
            </div>
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateUI;