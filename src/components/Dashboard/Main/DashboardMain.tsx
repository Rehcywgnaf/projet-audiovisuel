import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const DashboardMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simule une requête API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData({
          projects: 15,
          activeSubmissions: 5,
          pendingReviews: 3,
          completedThisMonth: 7
        });
        
        setIsLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d'ensemble</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Projets Total</h3>
            <p className="text-3xl font-bold mt-2">{data.projects}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Soumissions Actives</h3>
            <p className="text-3xl font-bold mt-2">{data.activeSubmissions}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium">En Attente de Revue</h3>
            <p className="text-3xl font-bold mt-2">{data.pendingReviews}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Complétés ce mois</h3>
            <p className="text-3xl font-bold mt-2">{data.completedThisMonth}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMain;