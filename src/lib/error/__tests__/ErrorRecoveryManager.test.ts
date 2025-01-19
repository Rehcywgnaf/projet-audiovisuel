import { ErrorRecoveryManager } from '../ErrorRecoveryManager';
import { Task, TaskType, RetryStrategy } from '@/types';

describe('ErrorRecoveryManager', () => {
  let errorRecoveryManager: ErrorRecoveryManager;
  let mockTask: Task;
  let retryEvents: any[] = [];
  let fatalErrorEvents: any[] = [];

  beforeEach(() => {
    errorRecoveryManager = new ErrorRecoveryManager();
    mockTask = {
      id: '1',
      type: TaskType.AAP,
      timestamp: Date.now()
    };
    retryEvents = [];
    fatalErrorEvents = [];

    window.addEventListener('taskRetry', ((e: CustomEvent) => {
      retryEvents.push(e.detail);
    }) as EventListener);

    window.addEventListener('taskFatalError', ((e: CustomEvent) => {
      fatalErrorEvents.push(e.detail);
    }) as EventListener);
  });

  test('should retry task with appropriate strategy', async () => {
    const mockStrategy: RetryStrategy = {
      shouldRetry: jest.fn().mockResolvedValue(true)
    };

    errorRecoveryManager.registerStrategy('NetworkError', mockStrategy);
    
    const error = new Error('NetworkError: Connection failed');
    const shouldRetry = await errorRecoveryManager.handleError(mockTask, error);

    expect(shouldRetry).toBe(true);
    expect(retryEvents).toHaveLength(1);
    expect(retryEvents[0].taskId).toBe(mockTask.id);
    expect(retryEvents[0].retryCount).toBe(1);
  });

  test('should stop retrying after max attempts', async () => {
    const mockStrategy: RetryStrategy = {
      shouldRetry: jest.fn().mockResolvedValue(true)
    };

    errorRecoveryManager.registerStrategy('NetworkError', mockStrategy);
    const error = new Error('NetworkError: Connection failed');

    await errorRecoveryManager.handleError(mockTask, error);
    await errorRecoveryManager.handleError(mockTask, error);
    await errorRecoveryManager.handleError(mockTask, error);
    const finalRetry = await errorRecoveryManager.handleError(mockTask, error);

    expect(finalRetry).toBe(false);
    expect(fatalErrorEvents).toHaveLength(1);
    expect(fatalErrorEvents[0].taskId).toBe(mockTask.id);
  });
});