import { useState, useCallback, useEffect } from 'react';
import { useDeadlineTracking } from '../services/deadlineTrackingService';
import { useAIDeadlineEnrichment } from '../services/aiDeadlineService';
import { Deadline, DeadlineFilter } from '../services/deadlineTypes';

export function useDeadlineManager() {
  const { 
    deadlines: trackedDeadlines, 
    addDeadline, 
    updateDeadline, 
    deleteDeadline 
  } = useDeadlineTracking();

  const { 
    enrichDeadline, 
    batchEnrichDeadlines 
  } = useAIDeadlineEnrichment();

  const [deadlines, setDeadlines] = useState<Deadline[]>(trackedDeadlines);
  const [filters, setFilters] = useState<DeadlineFilter>({});
  const [isLoading, setIsLoading] = useState(false);

  // Synchronisation avec le service de tracking
  useEffect(() => {
    setDeadlines(trackedDeadlines);
  }, [trackedDeadlines]);

  // Enrichissement automatique des deadlines critiques
  useEffect(() => {
    const enrichCriticalDeadlines = async () => {
      if (deadlines.length > 0) {
        setIsLoading(true);
        try {
          const enrichedDeadlines = await batchEnrichDeadlines(deadlines);
          setDeadlines(enrichedDeadlines);
        } catch (error) {
          console.error('Erreur lors de l\'enrichissement des deadlines', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    enrichCriticalDeadlines();
  }, [deadlines.length]);

  // Filtrage des deadlines
  const filteredDeadlines = useCallback(() => {
    return deadlines.filter(deadline => {
      const matchSearch = !filters.search || 
        deadline.projectName.toLowerCase().includes(filters.search.toLowerCase()) ||
        deadline.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchType = !filters.type || deadline.source === filters.type;
      const matchPriority = !filters.priority || deadline.priority === filters.priority;
      
      const matchDateMin = !filters.dateMin || 
        new Date(deadline.date) >= new Date(filters.dateMin);
      
      const matchDateMax = !filters.dateMax || 
        new Date(deadline.date) <= new Date(filters.dateMax);

      return matchSearch && matchType && matchPriority && 
             matchDateMin && matchDateMax;
    });
  }, [deadlines, filters]);

  // Méthode pour ajouter une deadline avec enrichissement potentiel
  const handleAddDeadline = async (newDeadline: Omit<Deadline, 'id' | 'daysLeft' | 'priority' | 'history'>) => {
    const addedDeadline = addDeadline(newDeadline);
    
    try {
      const enrichedDeadline = await enrichDeadline(addedDeadline);
      updateDeadline(enrichedDeadline.id, enrichedDeadline);
      return enrichedDeadline;
    } catch (error) {
      console.error('Erreur lors de l\'enrichissement de la nouvelle deadline', error);
      return addedDeadline;
    }
  };

  // Méthode pour mettre à jour une deadline avec potentiel enrichissement
  const handleUpdateDeadline = async (id: string, updates: Partial<Deadline>) => {
    updateDeadline(id, updates);
    
    try {
      const deadlineToEnrich = deadlines.find(d => d.id === id);
      if (deadlineToEnrich) {
        const enrichedDeadline = await enrichDeadline(deadlineToEnrich);
        updateDeadline(id, enrichedDeadline);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enrichissement de la deadline mise à jour', error);
    }
  };

  return {
    deadlines: filteredDeadlines(),
    addDeadline: handleAddDeadline,
    updateDeadline: handleUpdateDeadline,
    deleteDeadline,
    setFilters,
    filters,
    isLoading
  };
}
