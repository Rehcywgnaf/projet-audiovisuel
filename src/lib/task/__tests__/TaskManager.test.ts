import { TaskManager } from './TaskManager';
import { PriorityManager } from '../priority/PriorityManager';
import { Task, TaskType, TaskPriority } from '@/types';

describe('TaskManager', () => {
  let taskManager: TaskManager;
  let priorityManager: PriorityManager;

  beforeEach(() => {
    priorityManager = new PriorityManager();
    taskManager = new TaskManager(priorityManager);
  });

  const createTask = (
    id: string,
    type: TaskType = TaskType.AAP,
    deadline?: Date,
    budget?: number
  ): Task => ({
    id,
    type,
    deadline,
    budget
  });

  test('should add tasks to correct priority queues', async () => {
    // High priority task (urgent)
    const urgentTask = createTask('1', TaskType.AAP, new Date(Date.now() + 24 * 60 * 60 * 1000));
    
    // Standard priority task
    const standardTask = createTask('2', TaskType.AAP);
    
    // Low priority task
    const lowPriorityTask = createTask('3', TaskType.OTHER);

    await taskManager.addTask(urgentTask);
    await taskManager.addTask(standardTask);
    await taskManager.addTask(lowPriorityTask);

    const queueLengths = taskManager.getQueueLengths();
    expect(queueLengths).toEqual({
      high: 1,
      standard: 1,
      low: 1
    });
  });

  test('should process high priority tasks before others', async () => {
    const processedTasks: string[] = [];
    const mockProcessing = jest.spyOn(window, 'dispatchEvent').mockImplementation((event: Event) => {
      if (event instanceof CustomEvent && event.type === 'taskCompleted') {
        processedTasks.push(event.detail.task.id);
      }
      return true;
    });

    const highPriorityTask = createTask('high', TaskType.AAP, new Date(Date.now() + 24 * 60 * 60 * 1000));
    const standardPriorityTask = createTask('standard', TaskType.AAP);
    const lowPriorityTask = createTask('low', TaskType.OTHER);

    await Promise.all([
      taskManager.addTask(lowPriorityTask),
      taskManager.addTask(highPriorityTask),
      taskManager.addTask(standardPriorityTask)
    ]);

    await new Promise(resolve => setTimeout(resolve, 500));

    expect(processedTasks[0]).toBe('high');
    mockProcessing.mockRestore();
  });

  test('should emit events during task lifecycle', async () => {
    const events: string[] = [];
    const mockEventListener = (event: Event) => {
      events.push(event.type);
    };

    window.addEventListener('taskStarted', mockEventListener);
    window.addEventListener('taskCompleted', mockEventListener);

    const task = createTask('test');
    await taskManager.addTask(task);

    await new Promise(resolve => setTimeout(resolve, 200));

    expect(events).toEqual(['taskStarted', 'taskCompleted']);

    window.removeEventListener('taskStarted', mockEventListener);
    window.removeEventListener('taskCompleted', mockEventListener);
  });

  test('should handle task processing errors', async () => {
    let errorEvent: CustomEvent | null = null;
    const errorListener = (event: Event) => {
      if (event instanceof CustomEvent && event.type === 'taskError') {
        errorEvent = event;
      }
    };

    window.addEventListener('taskError', errorListener);

    // Simuler une erreur dans le traitement
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const task = createTask('error');
    const error = new Error('Test error');
    
    jest.spyOn(TaskManager.prototype as any, 'executeTask')
      .mockRejectedValueOnce(error);

    await taskManager.addTask(task);
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(errorEvent?.detail.error).toBe(error);
    expect(errorEvent?.detail.task.id).toBe('error');

    window.removeEventListener('taskError', errorListener);
  });
});