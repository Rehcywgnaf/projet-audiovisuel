import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2,
  X 
} from 'lucide-react';
import { rssProjectService, RSSSource } from '@/services/RSSProjectService';
import { veilleService, Opportunity } from '@/services/VeilleService';
import { LoggingService } from '@/lib/LoggingService';

const RSSManager: React.FC = () => {
  const [sources, setSources] = useState<RSSSource[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newSource, setNewSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loggingService = LoggingService.getInstance();

  // Charger les sources et opportunités au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Début du chargement des données');
        
        // Charger les sources
        const currentSources = rssProjectService.getSources();
        console.log('Sources RSS chargées:', currentSources.length);
        setSources(currentSources);

        // Charger les opportunités
        const fetchedOpportunities = await veilleService.fetchOpportunities();
        console.log('Opportunités récupérées:', fetchedOpportunities.length);
        setOpportunities(fetchedOpportunities);

        // Convertir en projets
        const convertedProjects = rssProjectService.convertToProjects();
        console.log('Projets convertis:', convertedProjects.length);
        setProjects(convertedProjects);

        // Log détaillé des projets
        convertedProjects.forEach((project, index) => {
          console.log(`Projet ${index + 1}:`, {
            id: project.id,
            title: project.title,
            organization: project.organization,
            status: project.status,
            progress: project.progress,
            priority: project.priority
          });
        });

      } catch (err) {
        console.error('Erreur de chargement initial', err);
        loggingService.error('Erreur de chargement initial', { error: err });
        setError('Impossible de charger les sources et opportunités');
      }
    };

    loadData();
  }, []);

  const addSource = async () => {
    if (!newSource) return;

    setIsLoading(true);
    setError(null);

    try {
      const added = await rssProjectService.addSource(newSource);
      
      if (added) {
        // Mettre à jour les sources et les opportunités
        const updatedSources = rssProjectService.getSources();
        setSources(updatedSources);

        const fetchedOpportunities = await veilleService.fetchOpportunities();
        setOpportunities(fetchedOpportunities);

        const convertedProjects = rssProjectService.convertToProjects();
        setProjects(convertedProjects);

        console.log(`Source ajoutée : ${newSource}`);
        setNewSource('');
      } else {
        setError('Impossible d\'ajouter la source');
        console.error(`Échec de l'ajout de la source : ${newSource}`);
      }
    } catch (err) {
      loggingService.error('Erreur d\'ajout de source', { error: err });
      setError('Erreur lors de l\'ajout de la source');
      console.error('Erreur lors de l\'ajout de la source', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSource = async (sourceId: number) => {
    try {
      const updatedSources = sources.filter(source => source.id !== sourceId);
      setSources(updatedSources);
      console.log(`Source supprimée : ${sourceId}`);
    } catch (err) {
      loggingService.error('Erreur de suppression de source', { error: err });
      setError('Impossible de supprimer la source');
      console.error('Erreur de suppression de source', err);
    }
  };

  const updateSourceAnalysis = async (sourceId: number) => {
    setIsLoading(true);
    try {
      await rssProjectService.updateSourceAnalysis(sourceId);
      const updatedSources = rssProjectService.getSources();
      setSources(updatedSources);
      console.log(`Analyse mise à jour pour la source : ${sourceId}`);
    } catch (err) {
      loggingService.error('Erreur de mise à jour de l\'analyse', { error: err });
      setError('Impossible de mettre à jour l\'analyse');
      console.error('Erreur de mise à jour de l\'analyse', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sources de Veille RSS</CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="URL de la source RSS"
              className="px-3 py-2 border rounded flex-grow"
              disabled={isLoading}
            />
            <button 
              onClick={addSource}
              disabled={isLoading || !newSource}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Ajouter
            </button>
          </div>
        </CardHeader>
        
        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-600 flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}

        <CardContent>
          <div className="space-y-4">
            {sources.map(source => (
              <div 
                key={source.id} 
                className="flex items-center justify-between p-4 border rounded hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Statut de la source */}
                  {source.status === 'active' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : source.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}

                  {/* Informations de la source */}
                  <div>
                    <p className="font-medium">{source.url}</p>
                    <p className="text-sm text-gray-500">
                      Type: {source.type} | 
                      Dernière analyse: {source.analysis?.lastAnalysis.toLocaleString() || 'Jamais'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {source.status === 'active' && (
                    <button
                      onClick={() => updateSourceAnalysis(source.id)}
                      className="p-2 hover:bg-blue-50 rounded"
                      title="Mettre à jour l'analyse"
                    >
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                    </button>
                  )}
                  <button
                    onClick={() => removeSource(source.id)}
                    className="p-2 hover:bg-red-50 rounded"
                    title="Supprimer la source"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Opportunités */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Opportunités Détectées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.length === 0 ? (
              <p className="text-gray-500 text-center">Aucune opportunité détectée</p>
            ) : (
              opportunities.map(opportunity => (
                <div 
                  key={opportunity.id} 
                  className="p-4 border rounded hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{opportunity.title}</h3>
                      <p className="text-sm text-gray-500">
                        Type: {opportunity.type} | 
                        Budget: {opportunity.budget} | 
                        Deadline: {opportunity.deadline}
                      </p>
                    </div>
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        opportunity.match > 80 ? 'bg-green-100 text-green-800' :
                        opportunity.match > 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      Pertinence: {opportunity.match}%
                    </span>
                  </div>
                  {opportunity.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {opportunity.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Projets */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Projets Convertis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center">Aucun projet converti</p>
            ) : (
              projects.map(project => (
                <div 
                  key={project.id} 
                  className="p-4 border rounded hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-500">
                        Organisation: {project.organization} | 
                        Statut: {project.status} | 
                        Progression: {project.progress}%
                      </p>
                    </div>
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        project.priority === 'high' ? 'bg-red-100 text-red-800' :
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      Priorité: {project.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSSManager;