import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Calendar, Clock, Plus, MoreVertical, Pencil, Trash2, History } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const DeadlineManager = () => {
  const initialDeadlines = [
    {
      id: '1',
      projectName: "Documentaire Nature",
      description: "Soumission du dossier CNC",
      date: "2024-02-15",
      daysLeft: 15,
      team: "Production",
      priority: "high",
      history: [
        {
          type: 'creation',
          date: '2024-01-02T10:00:00',
          details: 'Création initiale'
        }
      ]
    },
    {
      id: '2',
      projectName: "Web-série Innovation",
      description: "Deadline appel à projet régional",
      date: "2024-03-01",
      daysLeft: 30,
      team: "Production",
      priority: "medium",
      history: [
        {
          type: 'creation',
          date: '2024-01-02T11:30:00',
          details: 'Création initiale'
        }
      ]
    }
  ];

  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    date: '',
    team: '',
  });

  const calculateDaysLeft = (dateStr) => {
    const dateObj = new Date(dateStr);
    const today = new Date();
    const diffTime = dateObj - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const daysLeft = calculateDaysLeft(formData.date);
    const newDeadline = {
      id: selectedDeadline?.id || Date.now().toString(),
      ...formData,
      daysLeft,
      priority: daysLeft <= 10 ? 'high' : daysLeft <= 20 ? 'medium' : 'low'
    };

    if (selectedDeadline) {
      // Création d'une entrée d'historique pour la modification
      const changes = Object.entries(formData).reduce((acc, [key, value]) => {
        if (selectedDeadline[key] !== value) {
          acc[key] = {
            old: selectedDeadline[key],
            new: value
          };
        }
        return acc;
      }, {});

      if (Object.keys(changes).length > 0) {
        newDeadline.history = [
          ...(selectedDeadline.history || []),
          {
            type: 'modification',
            date: new Date().toISOString(),
            details: 'Modification des informations',
            changes
          }
        ];
      } else {
        newDeadline.history = selectedDeadline.history || [];
      }

      setDeadlines(deadlines.map(d => d.id === selectedDeadline.id ? newDeadline : d));
    } else {
      // Nouvelle deadline avec historique initial
      newDeadline.history = [{
        type: 'creation',
        date: new Date().toISOString(),
        details: 'Création initiale'
      }];
      setDeadlines([...deadlines, newDeadline]);
    }

    try {
      const content = JSON.stringify(deadlines.map(d => 
        d.id === newDeadline.id ? newDeadline : d
      ), null, 2);
      await window.fs.writeFile('deadlines.json', content);
    } catch (error) {
      console.warn('Sauvegarde impossible pour le moment:', error);
    }

    setDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedDeadline(null);
    setFormData({ projectName: '', description: '', date: '', team: '' });
  };

  const handleEdit = (deadline) => {
    setSelectedDeadline(deadline);
    setFormData({
      projectName: deadline.projectName,
      description: deadline.description,
      date: deadline.date,
      team: deadline.team,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const updatedDeadlines = deadlines.filter(d => d.id !== id);
    setDeadlines(updatedDeadlines);
    
    try {
      const content = JSON.stringify(updatedDeadlines, null, 2);
      await window.fs.writeFile('deadlines.json', content);
    } catch (error) {
      console.warn('Sauvegarde impossible pour le moment:', error);
    }
  };

  const getPriorityColor = (daysLeft) => {
    if (daysLeft <= 10) return 'bg-red-100 text-red-800';
    if (daysLeft <= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const DeadlineDialog = ({ isEdit = false }) => (
    <Dialog 
      open={isEdit ? editDialogOpen : dialogOpen} 
      onOpenChange={isEdit ? setEditDialogOpen : setDialogOpen}
    >
      <DialogTrigger asChild>
        {isEdit ? null : (
          <Button variant="default" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle Deadline
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier la deadline' : 'Créer une nouvelle deadline'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Nom du projet</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date limite</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Équipe</Label>
            <Select
              value={formData.team}
              onValueChange={(value) => setFormData({ ...formData, team: value })}
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
            {isEdit ? 'Modifier' : 'Créer'} la deadline
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const HistoryDialog = () => (
    <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Historique des modifications</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedDeadline?.history?.map((entry, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4 py-2">
              <div className="flex justify-between items-start">
                <span className="font-medium">
                  {entry.type === 'creation' ? 'Création' : 'Modification'}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleString('fr-FR')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
              {entry.changes && (
                <div className="mt-2 text-sm space-y-1">
                  {Object.entries(entry.changes).map(([field, values]) => (
                    <div key={field} className="text-gray-600">
                      <span className="font-medium">{field}: </span>
                      <span className="line-through text-red-500">{values.old}</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-500">{values.new}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  const sortDeadlinesByDaysLeft = (deadlines) => {
    return [...deadlines].sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const sortedDeadlines = sortDeadlinesByDaysLeft(deadlines);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Gestionnaire de Deadlines
        </CardTitle>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {sortedDeadlines.length} échéances
          </span>
          <DeadlineDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDeadlines.map((deadline) => (
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
                      <DropdownMenuItem onClick={() => handleEdit(deadline)}>
                        <Pencil className="mr-2 h-4 w-4" />
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
                        <AlertDialogTrigger className="w-full">
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
                            <AlertDialogAction onClick={() => handleDelete(deadline.id)}>
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
                  Équipe: {deadline.team}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <DeadlineDialog isEdit={true} />
      <HistoryDialog />
    </Card>
  );
};

export default DeadlineManager;
