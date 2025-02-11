export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(message: string, data?: any) {
    console.log(`[${this.context}] ${message}`, data || '');
  }

  error(message: string, data?: any) {
    console.error(`[${this.context}] ERROR: ${message}`, data || '');
  }

  warn(message: string, data?: any) {
    console.warn(`[${this.context}] WARNING: ${message}`, data || '');
  }

  static getInstance(context: string = 'DefaultLogger'): Logger {
    return new Logger(context);
  }
}