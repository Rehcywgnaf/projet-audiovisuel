type NotificationType = 'opportunity' | 'team' | 'project' | 'system';

interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

interface OpportunityNotification extends BaseNotification {
  type: 'opportunity';
  matchScore: number;
  criteria: Record<string, string>;
  url: string;
}

interface TeamNotification extends BaseNotification {
  type: 'team';
  teamId: string;
  action: 'assignment' | 'availability' | 'update';
  userId: string;
}

type Notification = OpportunityNotification | TeamNotification;

export class NotificationService {
  private static instance: NotificationService;
  private listeners: Map<string, (notification: Notification) => void>;

  private constructor() {
    this.listeners = new Map();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(id: string, callback: (notification: Notification) => void) {
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  send(notification: Notification) {
    this.listeners.forEach(callback => callback(notification));
  }

  markAsRead(notificationId: string) {
    // Implémentation à venir
  }
}