import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlanningPage() {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  const projects = [
    {
      id: 1,
      title: 'Documentaire Nature',
      timeline: [
        { month: 'Jan', status: 'active' },
        { month: 'Fév', status: 'active' },
        { month: 'Mar', status: 'planned' },
      ]
    },
    // Autres projets...
  ];

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Planning Annuel 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left">Projet</th>
                  {months.map(month => (
                    <th key={month} className="p-2 text-center w-20">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id} className="border-t">
                    <td className="p-2 font-medium">{project.title}</td>
                    {months.map(month => {
                      const cell = project.timeline.find(t => t.month === month);
                      return (
                        <td key={month} className="p-2 text-center">
                          {cell && (
                            <div className={`h-4 rounded ${cell.status === 'active' ? 'bg-blue-500' : 'bg-gray-200'}`} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}