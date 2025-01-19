import { Task, TaskPriority } from '@/types';
import { PriorityManager } from '../priority/PriorityManager';

export class TaskManager {
  private highPriorityQueue: Task[] = [];
  private standardQueue: Task[] = [];
  private lowPriorityQueue: Task[] = [];
  private isProcessing: boolean = false;
  private readonly priorityManager: PriorityManager;

  constructor(priorityManager: PriorityManager) {
    this.priorityManager = priorityManager;
  }

  async addTask(task: Task): Promise<void> {
    const priority = this.priorityManager.calculatePriority(task);
    this.addToQueue(task, priority);
    
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }

  private addToQueue(task: Task, priority: TaskPriority): void {
    switch (priority) {
      case TaskPriority.HIGH:
        this.highPriorityQueue.push(task);
        break;
      case TaskPriority.STANDARD:
        this.standardQueue.push(task);
        break;
      case TaskPriority.LOW:
        this.lowPriorityQueue.push(task);
        break;
    }
  }

  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      while (this.hasTasksInQueue()) {
        const nextTask = this.getNextTask();
        if (nextTask) {
          await this.processTask(nextTask);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private hasTasksInQueue(): boolean {
    return (
      this.highPriorityQueue.length > 0 ||
      this.standardQueue.length > 0 ||
      this.lowPriorityQueue.length > 0
    );
  }

  private getNextTask(): Task | null {
    if (this.highPriorityQueue.length > 0) {
      return this.highPriorityQueue.shift() || null;
    }
    if (this.standardQueue.length > 0) {
      return this.standardQueue.shift() || null;
    }
    if (this.lowPriorityQueue.length > 0) {
      return this.lowPriorityQueue.shift() || null;
    }
    return null;
  }

  private async processTask(task: Task): Promise<void> {
    try {
      // Log du début du traitement
      console.log(`Processing task ${task.id}`);
      
      // Event de début de traitement
      this.emitTaskEvent('taskStarted', task);
      
      // Traitement de la tâche
      await this.executeTask(task);
      
      // Event de fin de traitement
      this.emitTaskEvent('taskCompleted', task);
    } catch (error) {
      // Log et event d'erreur
      console.error(`Error processing task ${task.id}:`, error);
      this.emitTaskEvent('taskError', task, error);
      throw error;
    }
  }

  private async executeTask(task: Task): Promise<void> {
    // Placeholder pour le traitement réel
    // À implémenter selon les besoins spécifiques
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private emitTaskEvent(
    eventType: 'taskStarted' | 'taskCompleted' | 'taskError',
    task: Task,
    error?: Error
  ): void {
    const event = new CustomEvent(eventType, {
      detail: { task, error }
    });
    window.dispatchEvent(event);
  }

  // Méthodes utilitaires pour les tests et le monitoring
  getQueueLengths() {
    return {
      high: this.highPriorityQueue.length,
      standard: this.standardQueue.length,
      low: this.lowPriorityQueue.length
    };
  }
}