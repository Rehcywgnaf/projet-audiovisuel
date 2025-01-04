import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, AlertTriangle, Bell, FolderPlus, Save, FileEdit } from 'lucide-react';

function UnifiedDeadlineManager() {
  // États de base
  const [deadlines, setDeadlines] = useState([]);
  const [newDeadline, setNewDeadline] = useState({
    title: '',
    type: 'AAP',
    dueDate: '',
    notes: ''
  });

  // États pour la gestion des opportunités RSS
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  // État pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    source: '',
    dateMin: '',
    dateMax: ''
  });

  // Effet pour simuler le chargement initial des opportunités
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setOpportunities([
        {
          id: 'rss_1',
          source: 'CNC',
          title: 'Appel à projets documentaire',
          type: 'AAP',
          publishDate: '2024-01-20',
          dueDate: '2024-03-15',
          description: 'Aide à la création documentaire',
          budget: '50000'
        },
        {
          id: 'rss_2',
          source: 'Région IDF',
          title: 'Soutien à la production',
          type: 'AAP',
          publishDate: '2024-01-25',
          dueDate: '2024-04-01',
          description: 'Fonds régional',
          budget: '75000'
        }
      ]);
      setLastSync(new Date());
      setLoading(false);
    }, 1000);
  }, []);

  // Fonction pour forcer une synchronisation
  const forceSync = () => {
    setLoading(true);
    setTimeout(() => {
      setLastSync(new Date());
      setLoading(false);
    }, 1000);
  };

  // Fonction pour filtrer les opportunités
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = !filters.search || 
      opp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = !filters.type || opp.type === filters.type;
    const matchesSource = !filters.source || opp.source === filters.source;
    
    const matchesDateMin = !filters.dateMin || 
      new Date(opp.dueDate) >= new Date(filters.dateMin);
    
    const matchesDateMax = !filters.dateMax || 
      new Date(opp.dueDate) <= new Date(filters.dateMax);

    return matchesSearch && matchesType && matchesSource && 
           matchesDateMin && matchesDateMax;
  });

  // Gestion des deadlines
  const handleDeadlineSubmit = () => {
    const deadline = {
      id: Date.now(),
      ...newDeadline,
      status: 'en_cours',
      created: new Date()
    };
    setDeadlines(prev => [...prev, deadline]);
    setNewDeadline({
      title: '',
      type: 'AAP',
      dueDate: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="deadlines" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
        </TabsList>

        <TabsContent value="deadlines">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Gestionnaire de Deadlines
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Nouvelle Deadline
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle deadline</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label>Titre</label>
                        <Input
                          value={newDeadline.title}
                          onChange={(e) => setNewDeadline(prev => ({...prev, title: e.target.value}))}
                          placeholder="Titre du projet"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label>Type</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={newDeadline.type}
                          onChange={(e) => setNewDeadline(prev => ({...prev, type: e.target.value}))}
                        >
                          <option value="AAP">Appel à Projet</option>
                          <option value="AO">Appel d'Offre</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label>Date limite</label>
                        <Input
                          type="date"
                          value={newDeadline.dueDate}
                          onChange={(e) => setNewDeadline(prev => ({...prev, dueDate: e.target.value}))}
                        />
                      </div>

                      <div className="space-y-2">
                        <label>Notes</label>
                        <textarea
                          className="w-full p-2 border rounded"
                          value={newDeadline.notes}
                          onChange={(e) => setNewDeadline(prev => ({...prev, notes: e.target.value}))}
                          rows={3}
                          placeholder="Notes..."
                        />
                      </div>

                      <Button onClick={handleDeadlineSubmit}>
                        <Save className="w-4 h-4 mr-2" />
                        Créer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{deadline.title}</h3>
                        <p className="text-sm text-gray-500">{deadline.type}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                        {deadline.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Date limite: {new Date(deadline.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Opportunités Détectées
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {lastSync && (
                      <span className="text-sm text-gray-500">
                        Dernière synchro: {lastSync.toLocaleTimeString()}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={forceSync}
                      disabled={loading}
                    >
                      {loading ? 'Synchronisation...' : 'Synchroniser'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                  />

                  <select
                    className="p-2 border rounded"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
                  >
                    <option value="">Tous les types</option>
                    <option value="AAP">Appels à Projets</option>
                    <option value="AO">Appels d'Offres</option>
                  </select>

                  <select
                    className="p-2 border rounded"
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({...prev, source: e.target.value}))}
                  >
                    <option value="">Toutes les sources</option>
                    <option value="CNC">CNC</option>
                    <option value="Région IDF">Région IDF</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Date début</label>
                    <Input
                      type="date"
                      value={filters.dateMin}
                      onChange={(e) => setFilters(prev => ({...prev, dateMin: e.target.value}))}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Date fin</label>
                    <Input
                      type="date"
                      value={filters.dateMax}
                      onChange={(e) => setFilters(prev => ({...prev, dateMax: e.target.value}))}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="text-center py-4">Chargement des opportunités...</div>
              )}
              
              {error && (
                <Alert className="mb-4 bg-red-50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{opportunity.title}</h3>
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {opportunity.source}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{opportunity.type}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setNewDeadline({
                            title: opportunity.title,
                            type: opportunity.type,
                            dueDate: opportunity.dueDate,
                            notes: `Source: ${opportunity.source}\n\n${opportunity.description}`
                          });
                        }}
                      >
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Importer
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Publié le: {new Date(opportunity.publishDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Date limite: {new Date(opportunity.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {opportunity.description}
                      </p>

                      {opportunity.budget && (
                        <div className="text-sm text-gray-600">
                          Budget indicatif: {parseInt(opportunity.budget).toLocaleString()}€
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UnifiedDeadlineManager;
