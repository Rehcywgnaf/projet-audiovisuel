import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamsPage() {
  const teams = [
    {
      id: 1,
      name: 'Équipe Technique',
      members: [
        { name: 'Jean Dupont', role: 'Directeur Technique', projects: ['Documentaire Nature'] },
        { name: 'Marie Martin', role: 'Cadreur', projects: ['Web-série Innovation'] }
      ]
    },
    {
      id: 2,
      name: 'Production',
      members: [
        { name: 'Pierre Dubois', role: 'Producteur', projects: ['Documentaire Nature', 'Web-série Innovation'] }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map(team => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.projects.map(project => (
                          <span 
                            key={project}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}