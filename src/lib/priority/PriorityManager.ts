import { TaskPriority, TaskType, Task } from '@/types';

export class PriorityManager {
  private readonly SUPER_URGENT_THRESHOLD = 24; // heures
  private readonly URGENT_THRESHOLD = 48; // heures
  private readonly HIGH_VALUE_THRESHOLD = 100000; // euros
  private readonly priorityChanges = new Map<string, TaskPriority[]>();

  calculatePriority(task: Task): TaskPriority {
    const oldPriority = this.priorityChanges.get(task.id)?.at(-1);
    const newPriority = this.calculateNewPriority(task);
    
    if (oldPriority !== newPriority) {
      this.trackPriorityChange(task.id, newPriority);
    }
    
    return newPriority;
  }

  getPriorityScore(task: Task): number {
    let score = 0;
    
    // Urgence (0-40 points)
    const hoursUntilDeadline = this.getHoursUntilDeadline(task.deadline);
    if (hoursUntilDeadline <= this.SUPER_URGENT_THRESHOLD) {
      score += 40;
    } else if (hoursUntilDeadline <= this.URGENT_THRESHOLD) {
      score += 30;
    }
    
    // Valeur (0-40 points)
    if (task.budget) {
      score += Math.min(40, (task.budget / this.HIGH_VALUE_THRESHOLD) * 40);
    }
    
    // Type (0-20 points)
    if (this.isStandardOperation(task.type)) {
      score += 20;
    }
    
    return score;
  }

  private calculateNewPriority(task: Task): TaskPriority {
    // CRITICAL si super urgent ou urgent + haute valeur
    if (this.isSuperUrgent(task.deadline) || 
        (this.isUrgent(task.deadline) && this.isHighValue(task.budget))) {
      return TaskPriority.CRITICAL;
    }

    if (this.isUrgent(task.deadline) || this.isHighValue(task.budget)) {
      return TaskPriority.HIGH;
    }

    if (this.isStandardOperation(task.type)) {
      return TaskPriority.STANDARD;
    }

    return TaskPriority.LOW;
  }

  private isSuperUrgent(deadline: Date | undefined): boolean {
    if (!deadline) return false;
    const hoursUntilDeadline = this.getHoursUntilDeadline(deadline);
    return hoursUntilDeadline <= this.SUPER_URGENT_THRESHOLD;
  }

  private isUrgent(deadline: Date | undefined): boolean {
    if (!deadline) return false;
    const hoursUntilDeadline = this.getHoursUntilDeadline(deadline);
    return hoursUntilDeadline <= this.URGENT_THRESHOLD;
  }

  private isHighValue(budget: number | undefined): boolean {
    return budget ? budget > this.HIGH_VALUE_THRESHOLD : false;
  }

  private isStandardOperation(type: TaskType): boolean {
    return type === TaskType.AAP || type === TaskType.AO;
  }

  private getHoursUntilDeadline(deadline: Date | undefined): number {
    if (!deadline) return Infinity;
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.max(0, diff / (1000 * 60 * 60));
  }

  private trackPriorityChange(taskId: string, newPriority: TaskPriority) {
    const changes = this.priorityChanges.get(taskId) || [];
    changes.push(newPriority);
    this.priorityChanges.set(taskId, changes);
  }
}