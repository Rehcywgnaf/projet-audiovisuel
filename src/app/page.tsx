import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectStatus from '@/components/État d\'avancement du projet SAPAV';
import TeamTracking from '@/components/TeamTracking';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">SAPAV - Environnement de Test</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>État du Projet</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectStatus />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suivi des Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamTracking />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}