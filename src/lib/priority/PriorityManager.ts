import { TaskPriority, TaskType, Task } from '@/types';

export class PriorityManager {
  private readonly URGENT_THRESHOLD = 48; // heures
  private readonly HIGH_VALUE_THRESHOLD = 100000; // euros

  calculatePriority(task: Task): TaskPriority {
    if (this.isUrgent(task.deadline)) {
      return TaskPriority.HIGH;
    }

    if (this.isHighValue(task.budget)) {
      return TaskPriority.HIGH;
    }

    if (this.isStandardOperation(task.type)) {
      return TaskPriority.STANDARD;
    }

    return TaskPriority.LOW;
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

  private getHoursUntilDeadline(deadline: Date): number {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.max(0, diff / (1000 * 60 * 60));
  }
}