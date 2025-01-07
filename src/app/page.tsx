import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectList from '@/components/ProjectList';
import TagSuggestions from '@/components/TagSuggestions';
import OpportunityList from '@/components/OpportunityList';

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectList />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">350 000 €</div>
                <div className="text-sm text-gray-500">5 projets actifs</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prochaines Échéances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Montage final</span>
                    <span className="text-gray-500">15 jan</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rendu scénario</span>
                    <span className="text-gray-500">22 jan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle>Nouveaux Appels</CardTitle>
            </CardHeader>
            <CardContent>
              <OpportunityList />
            </CardContent>
          </Card>

          <TagSuggestions />
        </div>
      </div>
    </div>
  );
}