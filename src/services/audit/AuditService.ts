// services/audit/AuditService.ts
import { EventSystem } from '../events/EventSystem';

interface AuditEvent {
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
  severity: 'info' | 'warning' | 'critical';
}

export class AuditService {
  private static instance: AuditService;
  private eventSystem: EventSystem;
  private auditLog: AuditEvent[] = [];

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.initEventSubscriptions();
  }

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private initEventSubscriptions(): void {
    // Team events
    this.eventSystem.on('team:update', (data) => 
      this.handleAudit('team', data, 'info'));
    this.eventSystem.on('team:delete', (data) => 
      this.handleAudit('team', data, 'critical'));

    // Document events
    this.eventSystem.on('document:change', (data) => 
      this.handleAudit('document', data, 'info'));
    this.eventSystem.on('document:delete', (data) => 
      this.handleAudit('document', data, 'critical'));

    // Project events
    this.eventSystem.on('project:modify', (data) => 
      this.handleAudit('project', data, 'info'));
  }

  private async handleAudit(
    category: string,
    data: any,
    severity: 'info' | 'warning' | 'critical'
  ): Promise<void> {
    const auditEvent: AuditEvent = {
      type: `${category}:${data.action}`,
      data,
      timestamp: new Date(),
      userId: data.userId,
      severity
    };

    this.auditLog.push(auditEvent);

    if (severity === 'critical') {
      await this.notifyCriticalEvent(auditEvent);
    }

    this.cleanupOldLogs();
  }

  private async notifyCriticalEvent(event: AuditEvent): Promise<void> {
    this.eventSystem.emit('audit:critical', {
      action: 'notify',
      data: event,
      timestamp: new Date()
    });
  }

  private cleanupOldLogs(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.auditLog = this.auditLog.filter(log => log.timestamp > thirtyDaysAgo);
  }

  public async getAuditLogs(
    category?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<AuditEvent[]> {
    return this.auditLog.filter(log => {
      const matchesCategory = category ? log.type.startsWith(category) : true;
      const matchesDateRange = (!startDate || log.timestamp >= startDate) &&
                             (!endDate || log.timestamp <= endDate);
      return matchesCategory && matchesDateRange;
    });
  }
}