import { useState } from 'react';
import { Deadline, DeadlineHistoryEntry } from './deadlineTypes';

export function useDeadlineTracking() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  const calculateDaysLeft = (dateStr: string): number => {
    const dateObj = new Date(dateStr);
    const today = new Date();
    const diffTime = dateObj.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const determinePriority = (daysLeft: number): Deadline['priority'] => {
    if (daysLeft <= 10) return 'high';
    if (daysLeft <= 20) return 'medium';
    return 'low';
  };

  const addDeadline = (newDeadline: Omit<Deadline, 'id' | 'daysLeft' | 'priority' | 'history'>) => {
    const daysLeft = calculateDaysLeft(newDeadline.date);
    const deadline: Deadline = {
      ...newDeadline,
      id: Date.now().toString(),
      daysLeft,
      priority: determinePriority(daysLeft),
      history: [
        {
          type: 'creation',
          date: new Date().toISOString(),
          details: 'Création initiale de la deadline'
        }
      ]
    };

    setDeadlines(prev => [...prev, deadline]);
    return deadline;
  };

  const updateDeadline = (id: string, updates: Partial<Deadline>) => {
    setDeadlines(prev => prev.map(deadline => {
      if (deadline.id === id) {
        const changes: Record<string, { old: any; new: any }> = {};
        
        Object.entries(updates).forEach(([key, value]) => {
          if (deadline[key] !== value) {
            changes[key] = { 
              old: deadline[key], 
              new: value 
            };
          }
        });

        const updatedDeadline = {
          ...deadline,
          ...updates,
          daysLeft: updates.date 
            ? calculateDaysLeft(updates.date)
            : deadline.daysLeft,
          priority: updates.date
            ? determinePriority(calculateDaysLeft(updates.date))
            : deadline.priority,
          history: [
            ...(deadline.history || []),
            {
              type: 'modification',
              date: new Date().toISOString(),
              details: 'Mise à jour des informations',
              changes: Object.keys(changes).length > 0 ? changes : undefined
            }
          ]
        };

        return updatedDeadline;
      }
      return deadline;
    }));
  };

  const deleteDeadline = (id: string) => {
    setDeadlines(prev => prev.filter(deadline => deadline.id !== id));
  };

  return { 
    deadlines, 
    addDeadline, 
    updateDeadline, 
    deleteDeadline,
    calculateDaysLeft,
    determinePriority
  };
}
