import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AOSubmissionProps {
  title: string;
  deadline: Date;
  budget: number;
  requirements: string[];
}

export default function AOSubmission({
  title,
  deadline,
  budget,
  requirements
}: AOSubmissionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium">Date limite</p>
              <p>{deadline.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Budget</p>
              <p>{budget.toLocaleString()}€</p>
            </div>
            <div>
              <p className="text-sm font-medium">Critères</p>
              <ul className="list-disc pl-4">
                {requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}