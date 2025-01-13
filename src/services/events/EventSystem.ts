// services/events/EventSystem.ts
import { EventQueue } from './EventQueue';
import { EventProcessor } from './EventProcessor';

interface EventData {
  action: string;
  data: any;
  timestamp: Date;
  source?: string;
}

type EventHandler = (data: EventData) => void;

export class EventSystem {
  private static instance: EventSystem;
  private eventQueue: EventQueue;
  private eventProcessor: EventProcessor;
  private handlers: Map<string, Set<EventHandler>>;

  private constructor() {
    this.eventQueue = new EventQueue();
    this.eventProcessor = new EventProcessor();
    this.handlers = new Map();
    this.initProcessor();
  }

  static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem();
    }
    return EventSystem.instance;
  }

  emit(eventType: string, data: EventData): void {
    const enrichedData = {
      ...data,
      timestamp: data.timestamp || new Date(),
      source: data.source || 'system'
    };

    this.eventQueue.enqueue({ type: eventType, data: enrichedData });

    if (this.isHighPriority(eventType)) {
      this.processImmediately(eventType, enrichedData);
    }
  }

  on(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)?.add(handler);
  }

  off(eventType: string, handler: EventHandler): void {
    this.handlers.get(eventType)?.delete(handler);
  }

  private isHighPriority(eventType: string): boolean {
    const highPriorityEvents = [
      'team:update',
      'document:critical',
      'security:alert'
    ];
    return highPriorityEvents.includes(eventType);
  }

  private async processImmediately(eventType: string, data: EventData): Promise<void> {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        try {
          await Promise.resolve(handler(data));
        } catch (error) {
          console.error(`Error processing event ${eventType}:`, error);
        }
      }
    }
  }

  private initProcessor(): void {
    setInterval(() => {
      const event = this.eventQueue.dequeue();
      if (event) {
        this.processImmediately(event.type, event.data);
      }
    }, 1000);
  }
}