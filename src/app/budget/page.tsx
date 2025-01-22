import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BudgetPage() {
  const budgetData = {
    total: 350000,
    allocated: 275000,
    remaining: 75000,
    projects: [
      {
        title: 'Documentaire Nature',
        budget: 75000,
        spent: 45000,
        remaining: 30000
      }
    ]
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{budgetData.total.toLocaleString()}€</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alloué</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {budgetData.allocated.toLocaleString()}€
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(budgetData.allocated / budgetData.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {budgetData.remaining.toLocaleString()}€
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail par projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.projects.map((project, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-gray-500">
                    {project.spent.toLocaleString()}€ / {project.budget.toLocaleString()}€
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(project.spent / project.budget) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}