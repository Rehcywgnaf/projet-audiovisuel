import { EventSystem } from '../core/EventSystem';

type ErrorCode = 
  | 'DRIVE_INIT_ERROR' 
  | 'FILE_CREATE_ERROR' 
  | 'FILE_READ_ERROR' 
  | 'FILE_UPDATE_ERROR'
  | 'FILE_DELETE_ERROR'
  | 'METADATA_ERROR'
  | 'OPERATION_ERROR'
  | 'PERMISSION_ERROR'
  | 'NETWORK_ERROR'
  | 'CACHE_ERROR';

interface ErrorDetails {
  code: ErrorCode;
  message: string;
  timestamp: number;
  originalError?: any;
  context?: Record<string, any>;
}

interface ErrorConfig {
  maxRetries: number;
  retryDelay: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

class ErrorHandling {
  private static instance: ErrorHandling;
  private eventSystem: EventSystem;
  private errorLog: ErrorDetails[] = [];
  private config: ErrorConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    logLevel: 'error'
  };

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.initializeEventListeners();
  }

  static getInstance(): ErrorHandling {
    if (!ErrorHandling.instance) {
      ErrorHandling.instance = new ErrorHandling();
    }
    return ErrorHandling.instance;
  }

  private initializeEventListeners(): void {
    this.eventSystem.on('configChanged', (newConfig: Partial<ErrorConfig>) => {
      this.updateConfig(newConfig);
    });
  }

  configure(config: Partial<ErrorConfig>): void {
    this.updateConfig(config);
  }

  handleError(code: ErrorCode, error: any, context?: Record<string, any>): Error {
    const errorDetails: ErrorDetails = {
      code,
      message: error.message || 'Une erreur est survenue',
      timestamp: Date.now(),
      originalError: error,
      context
    };

    this.logError(errorDetails);
    this.emitErrorEvent(errorDetails);

    if (this.isRetryableError(code)) {
      return this.handleRetryableError(errorDetails);
    }

    return this.createError(errorDetails);
  }

  clearLogs(): void {
    this.errorLog = [];
  }

  getLogs(options?: {
    code?: ErrorCode;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): ErrorDetails[] {
    let filteredLogs = [...this.errorLog];

    if (options?.code) {
      filteredLogs = filteredLogs.filter(log => log.code === options.code);
    }

    if (options?.startTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= options.startTime!);
    }

    if (options?.endTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= options.endTime!);
    }

    if (options?.limit) {
      filteredLogs = filteredLogs.slice(-options.limit);
    }

    return filteredLogs;
  }

  hasActiveErrors(): boolean {
    const recentThreshold = Date.now() - (5 * 60 * 1000);
    return this.errorLog.some(error => error.timestamp > recentThreshold);
  }

  private updateConfig(newConfig: Partial<ErrorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  private logError(error: ErrorDetails): void {
    this.errorLog.push(error);
    
    if (this.errorLog.length > 1000) {
      this.errorLog = this.errorLog.slice(-1000);
    }

    if (this.config.logLevel === 'debug') {
      console.debug('[ERROR]', error);
    } else if (this.config.logLevel === 'info') {
      console.info('[ERROR]', error.code, error.message);
    } else if (this.config.logLevel === 'warn') {
      console.warn('[ERROR]', error.code, error.message);
    } else {
      console.error('[ERROR]', error.code, error.message);
    }
  }

  private emitErrorEvent(error: ErrorDetails): void {
    this.eventSystem.emit('error', error);
  }

  private isRetryableError(code: ErrorCode): boolean {
    return [
      'NETWORK_ERROR',
      'DRIVE_INIT_ERROR',
      'METADATA_ERROR'
    ].includes(code);
  }

  private async handleRetryableError(error: ErrorDetails): Promise<Error> {
    let retryCount = 0;
    let lastError = error;

    while (retryCount < this.config.maxRetries) {
      try {
        await this.delay(this.config.retryDelay * Math.pow(2, retryCount));
        this.eventSystem.emit('retryOperation', {
          code: error.code,
          context: error.context,
          attempt: retryCount + 1
        });
        return new Error(`Opération réessayée après ${retryCount + 1} tentatives`);
      } catch (e) {
        lastError = {
          ...error,
          message: e.message,
          originalError: e
        };
        retryCount++;
      }
    }

    return this.createError({
      ...lastError,
      message: `Échec après ${retryCount} tentatives: ${lastError.message}`
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createError(details: ErrorDetails): Error {
    const error = new Error(details.message);
    error['code'] = details.code;
    error['context'] = details.context;
    error['timestamp'] = details.timestamp;
    return error;
  }

  getStats(): {
    totalErrors: number;
    errorsByCode: Record<ErrorCode, number>;
    recentErrors: number;
  } {
    const now = Date.now();
    const recentThreshold = now - (5 * 60 * 1000);
    const errorsByCode = {} as Record<ErrorCode, number>;

    this.errorLog.forEach(error => {
      errorsByCode[error.code] = (errorsByCode[error.code] || 0) + 1;
    });

    return {
      totalErrors: this.errorLog.length,
      errorsByCode,
      recentErrors: this.errorLog.filter(error => error.timestamp > recentThreshold).length
    };
  }
}

export default ErrorHandling;