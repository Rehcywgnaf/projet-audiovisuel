import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertTriangle, Clock, FileText, Users, Lightbulb, ArrowRight, Cpu } from 'lucide-react';
import AIServiceManager from '@/lib/AIServiceManager';
import { useAI } from '@/hooks/useAI';

const DashboardPrincipal = () => {
  const { stats: aiStats } = useAI('global');
  const [aiManagerStats, setAIManagerStats] = useState<any>(null);

  useEffect(() => {
    const aiManager = AIServiceManager.getInstance();
    const stats = aiManager.getAllStats();
    setAIManagerStats(Object.fromEntries(stats));
  }, []);

  const projectsData = [
    {name: 'Jan', aap: 4, ao: 2, success: 3},
    {name: 'Fév', aap: 6, ao: 3, success: 4},
    {name: 'Mars', aap: 3, ao: 4, success: 5},
    {name: 'Avr', aap: 5, ao: 2, success: 3}
  ];

  const newOpportunities = [
    {
      id: 1,
      type: 'AAP',
      title: 'Production Documentaire Innovation',
      budget: '150k€',
      deadline: '15 Fév',
      match: 92
    },
    {
      id: 2,
      type: 'AO',
      title: 'Série Web Jeunesse',
      budget: '80k€',
      deadline: '1 Mars',
      match: 88
    },
    {
      id: 3,
      type: 'AAP',
      title: 'Court-métrage Région Sud',
      budget: '50k€',
      deadline: '20 Fév',
      match: 85
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Métriques IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Métriques IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm text-gray-500">Coût Total</h3>
              <p className="text-2xl font-bold">{aiStats?.totalCost ? `$${aiStats.totalCost.toFixed(2)}` : 'N/A'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm text-gray-500">Requêtes IA</h3>
              <p className="text-2xl font-bold">{aiStats?.requests || 0}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm text-gray-500">Cache Hits</h3>
              <p className="text-2xl font-bold">{aiStats?.cacheHits || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reste du code existant... */}
      {/* Nouvelles Opportunités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Nouvelles Opportunités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      opportunity.type === 'AAP' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {opportunity.type}
                    </span>
                    <span className="font-medium">{opportunity.title}</span>
                  </div>
                  <div className="text-sm text-gray-500 flex gap-4">
                    <span>Budget: {opportunity.budget}</span>
                    <span>Deadline: {opportunity.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-sm font-medium ${
                    opportunity.match > 90 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    Match {opportunity.match}%
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reste du composant inchangé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">
              Activité Projets & Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="aap" name="AAP" stroke="#8884d8" />
                  <Line type="monotone" dataKey="ao" name="AO" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="success" name="Succès" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">Projets Actifs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">78%</div>
                <div className="text-xs text-muted-foreground">Taux de Succès</div>
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-muted-foreground">Équipes Mobilisées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Points d'Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  3 deadlines approchent dans les 7 prochains jours
                </AlertDescription>
              </Alert>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  2 revues de projet planifiées cette semaine
                </AlertDescription>
              </Alert>
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  5 documents en attente de validation
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPrincipal;