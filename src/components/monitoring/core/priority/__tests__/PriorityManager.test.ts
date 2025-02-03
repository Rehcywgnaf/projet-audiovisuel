import { PriorityManager } from '../PriorityManager';
import { TaskPriority, TaskType, Task } from '../../../types/priority.types';

describe('PriorityManager', () => {
  let priorityManager: PriorityManager;

  beforeEach(() => {
    priorityManager = new PriorityManager();
  });

  test('should assign CRITICAL priority to urgent and high value tasks', () => {
    const criticalTask: Task = {
      id: '1',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      budget: 150000
    };
    expect(priorityManager.calculatePriority(criticalTask)).toBe(TaskPriority.CRITICAL);
  });

  test('should assign CRITICAL priority to super urgent tasks (<24h)', () => {
    const superUrgentTask: Task = {
      id: '2',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
      budget: 50000
    };
    expect(priorityManager.calculatePriority(superUrgentTask)).toBe(TaskPriority.CRITICAL);
  });

  test('should assign HIGH priority to urgent tasks', () => {
    const urgentTask: Task = {
      id: '3',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 36 * 60 * 60 * 1000),
      budget: 50000
    };
    expect(priorityManager.calculatePriority(urgentTask)).toBe(TaskPriority.HIGH);
  });

  test('should assign HIGH priority to high value tasks', () => {
    const highValueTask: Task = {
      id: '4',
      type: TaskType.AO,
      deadline: new Date(Date.now() + 96 * 60 * 60 * 1000),
      budget: 150000
    };
    expect(priorityManager.calculatePriority(highValueTask)).toBe(TaskPriority.HIGH);
  });

  test('should assign STANDARD priority to normal AAP/AO', () => {
    const standardTask: Task = {
      id: '5',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 96 * 60 * 60 * 1000),
      budget: 50000
    };
    expect(priorityManager.calculatePriority(standardTask)).toBe(TaskPriority.STANDARD);
  });

  test('should assign LOW priority to non-critical tasks', () => {
    const lowPriorityTask: Task = {
      id: '6',
      type: TaskType.OTHER,
      deadline: new Date(Date.now() + 96 * 60 * 60 * 1000),
      budget: 5000
    };
    expect(priorityManager.calculatePriority(lowPriorityTask)).toBe(TaskPriority.LOW);
  });

  test('should calculate priority score correctly', () => {
    const task: Task = {
      id: '7',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 36 * 60 * 60 * 1000),
      budget: 120000
    };
    const score = priorityManager.getPriorityScore(task);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should track priority changes', () => {
    const task: Task = {
      id: '8',
      type: TaskType.AAP,
      deadline: new Date(Date.now() + 96 * 60 * 60 * 1000),
      budget: 50000
    };
    const initialPriority = priorityManager.calculatePriority(task);
    task.deadline = new Date(Date.now() + 12 * 60 * 60 * 1000);
    const newPriority = priorityManager.calculatePriority(task);
    
    expect(initialPriority).toBe(TaskPriority.STANDARD);
    expect(newPriority).toBe(TaskPriority.CRITICAL);
  });
});