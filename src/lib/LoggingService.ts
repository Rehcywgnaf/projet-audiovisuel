export class LoggingService {
  private static instance: LoggingService;
  private logs: Array<{
    timestamp: Date;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
    context?: Record<string, any>;
  }> = [];

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  log(message: string, context?: Record<string, any>) {
    const logEntry = {
      timestamp: new Date(),
      level: 'INFO',
      message,
      context
    };

    this.logs.push(logEntry);
    console.log(JSON.stringify(logEntry));
  }

  warn(message: string, context?: Record<string, any>) {
    const logEntry = {
      timestamp: new Date(),
      level: 'WARN',
      message,
      context
    };

    this.logs.push(logEntry);
    console.warn(JSON.stringify(logEntry));
  }

  error(message: string, context?: Record<string, any>) {
    const logEntry = {
      timestamp: new Date(),
      level: 'ERROR',
      message,
      context
    };

    this.logs.push(logEntry);
    console.error(JSON.stringify(logEntry));
  }

  getLogs(options?: {
    level?: 'INFO' | 'WARN' | 'ERROR';
    since?: Date;
  }) {
    return this.logs.filter(log => {
      let match = true;
      if (options?.level) match = match && log.level === options.level;
      if (options?.since) match = match && log.timestamp >= options.since;
      return match;
    });
  }

  clearLogs() {
    this.logs = [];
  }
}