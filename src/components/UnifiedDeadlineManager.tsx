import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, AlertTriangle, Bell, FolderPlus, Save, FileEdit, History, MoreVertical, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import { useDeadlineManager } from '../hooks/useDeadlineManager';
import { Deadline } from '../services/deadlineTypes';

function UnifiedDeadlineManager() {
  const { 
    deadlines, 
    addDeadline, 
    updateDeadline, 
    deleteDeadline, 
    setFilters, 
    filters,
    isLoading 
  } = useDeadlineManager();

  // États pour la gestion des opportunités RSS
  const [opportunities, setOpportunities] = useState([]);
  const [rssLoading, setRssLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const [newDeadline, setNewDeadline] = useState({
    projectName: '',
    description: '',
    date: '',
    team: '',
    source: 'Manual'
  });

  // Effet pour simuler le chargement initial des opportunités RSS
  useEffect(() => {
    setRssLoading(true);
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
      setRssLoading(false);
    }, 1000);
  }, []);

  // Fonction pour filtrer les opportunités RSS
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

  // Forcer une synchronisation RSS
  const forceSync = () => {
    setRssLoading(true);
    setTimeout(() => {
      setLastSync(new Date());
      setRssLoading(false);
    }, 1000);
  };

  // Méthodes de gestion des deadlines
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const deadlineToAdd = {
      projectName: newDeadline.projectName,
      description: newDeadline.description,
      date: newDeadline.date,
      team: newDeadline.team,
      source: newDeadline.source
    };

    await addDeadline(deadlineToAdd);
    
    // Réinitialiser le formulaire
    setNewDeadline({
      projectName: '',
      description: '',
      date: '',
      team: '',
      source: 'Manual'
    });
    setDialogOpen(false);
  };

  // Calculer la couleur de priorité
  const getPriorityColor = (daysLeft: number) => {
    if (daysLeft <= 10) return 'bg-red-100 text-red-800';
    if (daysLeft <= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
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
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Nouvelle Deadline
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedDeadline ? 'Modifier la deadline' : 'Nouvelle deadline'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label>Nom du projet</label>
                        <Input
                          value={newDeadline.projectName}
                          onChange={(e) => setNewDeadline(prev => ({...prev, projectName: e.target.value}))}
                          placeholder="Titre du projet"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label>Description</label>
                        <Input
                          value={newDeadline.description}
                          onChange={(e) => setNewDeadline(prev => ({...prev, description: e.target.value}))}
                          placeholder="Description du projet"
                        />
                      </div>

                      <div className="space-y-2">
                        <label>Date limite</label>
                        <Input
                          type="date"
                          value={newDeadline.date}
                          onChange={(e) => setNewDeadline(prev => ({...prev, date: e.target.value}))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label>Équipe</label>
                        <Select
                          value={newDeadline.team}
                          onValueChange={(value) => setNewDeadline(prev => ({...prev, team: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une équipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Équipe Technique">Équipe Technique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full">
                        {selectedDeadline ? 'Modifier' : 'Créer'} la deadline
                      </Button>
                    </form>
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
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{deadline.projectName}</h3>
                        <p className="text-sm text-gray-500">{deadline.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(deadline.daysLeft)}`}
                        >
                          {deadline.daysLeft} jours restants
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedDeadline(deadline);
                              setNewDeadline({
                                projectName: deadline.projectName,
                                description: deadline.description,
                                date: deadline.date,
                                team: deadline.team,
                                source: deadline.source || 'Manual'
                              });
                              setDialogOpen(true);
                            }}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedDeadline(deadline);
                              setHistoryDialogOpen(true);
                            }}>
                              <History className="mr-2 h-4 w-4" />
                              Historique
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cette deadline ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteDeadline(deadline.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Date limite: {new Date(deadline.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Équipe: {deadline.team || 'Non définie'}
                      </span>
                    </div>

                    {deadline.aiSuggestion && (
                      <div className="mt-2 bg-blue-50 p-2 rounded-lg">
                        <h4 className="font-medium text-sm text-blue-800">Suggestions IA</h4>
                        <ul className="text-xs text-blue-700 list-disc list-inside">
                          {deadline.aiSuggestion.aiInsights?.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Le reste du code pour l'onglet Opportunités reste similaire */}
        <TabsContent value="opportunities">
          {/* ... (code de l'onglet Opportunités) ... */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UnifiedDeadlineManager;
