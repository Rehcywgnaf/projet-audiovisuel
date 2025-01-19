import { QueueMonitor } from '../QueueMonitor';
import { Task, TaskType } from '@/types';

describe('QueueMonitor', () => {
  let queueMonitor: QueueMonitor;

  beforeEach(() => {
    queueMonitor = new QueueMonitor();
  });

  const createTask = (id: string, timestamp: number): Task => ({
    id,
    type: TaskType.AAP,
    timestamp
  });

  test('should emit size alert when queue size exceeds threshold', () => {
    const alerts: any[] = [];
    queueMonitor.onAlert((alert) => alerts.push(alert));

    queueMonitor.updateMetrics(
      { high: 11, standard: 5, low: 5 },
      { high: null, standard: null, low: null }
    );

    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe('QUEUE_SIZE');
    expect(alerts[0].priority).toBe('high');
  });

  test('should emit wait time alert for old tasks', () => {
    const alerts: any[] = [];
    queueMonitor.onAlert((alert) => alerts.push(alert));

    const oldTask = createTask('1', Date.now() - 400000);
    queueMonitor.updateMetrics(
      { high: 5, standard: 5, low: 5 },
      { 
        high: oldTask,
        standard: null,
        low: null 
      }
    );

    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe('WAIT_TIME');
    expect(alerts[0].priority).toBe('high');
  });

  test('should allow removing alert listeners', () => {
    const alerts: any[] = [];
    const removeListener = queueMonitor.onAlert((alert) => alerts.push(alert));

    queueMonitor.updateMetrics(
      { high: 11, standard: 5, low: 5 },
      { high: null, standard: null, low: null }
    );
    expect(alerts).toHaveLength(1);

    removeListener();

    queueMonitor.updateMetrics(
      { high: 12, standard: 5, low: 5 },
      { high: null, standard: null, low: null }
    );
    expect(alerts).toHaveLength(1);
  });
});