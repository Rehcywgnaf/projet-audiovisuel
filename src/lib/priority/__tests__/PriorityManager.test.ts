import { PriorityManager } from '../PriorityManager';
import { TaskPriority, TaskType, Task } from '@/types';

describe('PriorityManager', () => {
  let priorityManager: PriorityManager;

  beforeEach(() => {
    priorityManager = new PriorityManager();
  });

  test('should assign HIGH priority to urgent tasks', () => {
    const urgentTask: Task = {
      id: '1',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      budget: 50000
    };

    expect(priorityManager.calculatePriority(urgentTask)).toBe(TaskPriority.HIGH);
  });

  test('should assign HIGH priority to high value tasks', () => {
    const highValueTask: Task = {
      id: '2',
      type: TaskType.AO,
      deadline: new Date(Date.now() + 96 * 60 * 60 * 1000),
      budget: 150000
    };

    expect(priorityManager.calculatePriority(highValueTask)).toBe(TaskPriority.HIGH);
  });

  test('should assign STANDARD priority to normal AAP/AO', () => {
    const standardTask: Task = {
      id: '3',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 96 * 60 * 60 * 1000),
      budget: 50000
    };

    expect(priorityManager.calculatePriority(standardTask)).toBe(TaskPriority.STANDARD);
  });

  test('should assign LOW priority to non-critical tasks', () => {
    const lowPriorityTask: Task = {
      id: '4',
      type: TaskType.OTHER,
      deadline: new Date(Date.now() + 96 * 60 * 60 * 1000),
      budget: 5000
    };

    expect(priorityManager.calculatePriority(lowPriorityTask)).toBe(TaskPriority.LOW);
  });
});