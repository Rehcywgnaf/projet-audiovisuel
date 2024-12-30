import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ProjectOpportunity } from '@/services/projectWatch';

export function OpportunityNotification({ opportunity }: { opportunity: ProjectOpportunity }) {
  return (
    <Card className="mb-4 hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
        <span className={`px-2 py-1 rounded-full text-sm ${getMatchScoreColor(opportunity.matchScore)}`}>
          {opportunity.matchScore}% match
        </span>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600">{opportunity.description}</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(opportunity.criteria).map(([key, value]) => (
            value && (
              <span key={key} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                {key}: {value}
              </span>
            )
          ))}
        </div>
        <a 
          href={opportunity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Voir l'appel à projet
        </a>
      </CardContent>
    </Card>
  );
}

function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
}
