import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Film, Calendar, PiggyBank, FileCheck, AlertCircle } from 'lucide-react';

export default function ProjectList() {
  const projects = [
    {
      id: 1,
      title: 'Documentaire Nature',
      type: 'CNC',
      deadline: '2024-03-15',
      budget: 150000,
      status: 'En cours'
    },
    {
      id: 2,
      title: 'Web-série Innovation',
      type: 'Région IDF',
      deadline: '2024-04-01',
      budget: 75000,
      status: 'À soumettre'
    },
    {
      id: 3,
      title: 'Court-métrage Jeunesse',
      type: 'Procirep',
      deadline: '2024-02-28',
      budget: 45000,
      status: 'En revue'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="w-5 h-5" />
          Projets en cours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.type}</p>
                </div>
                <span 
                  className={`px-2 py-1 rounded-full text-sm ${
                    project.status === 'En cours' 
                      ? 'bg-blue-100 text-blue-800'
                      : project.status === 'À soumettre'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Date limite:</span>
                  <span>{project.deadline}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <PiggyBank className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Budget:</span>
                  <span>{project.budget.toLocaleString()}€</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}