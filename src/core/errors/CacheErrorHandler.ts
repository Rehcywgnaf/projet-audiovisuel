import { EventSystem } from '../EventSystem';
import { CacheError, CacheErrorType } from './CacheError';

export class CacheErrorHandler {
  private static instance: CacheErrorHandler;
  private eventSystem: EventSystem;
  private readonly MAX_RETRIES = 3;
  private retryCount: Map<string, number>;

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.retryCount = new Map();
  }

  static getInstance(): CacheErrorHandler {
    if (!CacheErrorHandler.instance) {
      CacheErrorHandler.instance = new CacheErrorHandler();
    }
    return CacheErrorHandler.instance;
  }

  async handleError(error: CacheError, operationKey: string): Promise<void> {
    // Incrémenter le compteur de tentatives
    const currentRetries = this.retryCount.get(operationKey) || 0;
    this.retryCount.set(operationKey, currentRetries + 1);

    // Émettre l'événement d'erreur
    this.eventSystem.emit('cacheError', {
      type: error.type,
      details: error.details,
      retryCount: currentRetries
    });

    // Gérer selon le type d'erreur
    switch (error.type) {
      case CacheErrorType.STORAGE_FULL:
        await this.handleStorageFull();
        break;
      
      case CacheErrorType.EXPIRED_DATA:
        await this.handleExpiredData(error.details);
        break;
      
      case CacheErrorType.QUOTA_EXCEEDED:
        await this.handleQuotaExceeded();
        break;
      
      default:
        this.handleGenericError(error);
    }

    // Si trop de tentatives, arrêter les retry
    if (currentRetries >= this.MAX_RETRIES) {
      this.retryCount.delete(operationKey);
      throw error;
    }
  }

  private async handleStorageFull(): Promise<void> {
    // Nettoyer le cache automatiquement
    this.eventSystem.emit('cacheClearRequest', {
      reason: 'STORAGE_FULL',
      priority: 'HIGH'
    });
  }

  private async handleExpiredData(details: any): Promise<void> {
    // Supprimer les données expirées
    this.eventSystem.emit('cacheInvalidateRequest', {
      items: details.expiredKeys,
      reason: 'EXPIRED'
    });
  }

  private async handleQuotaExceeded(): Promise<void> {
    // Nettoyer le cache par ancienneté
    this.eventSystem.emit('cacheClearRequest', {
      reason: 'QUOTA_EXCEEDED',
      priority: 'MEDIUM',
      strategy: 'LRU'
    });
  }

  private handleGenericError(error: CacheError): void {
    console.error('Cache error:', {
      type: error.type,
      message: error.message,
      details: error.details
    });
  }

  clearRetryCount(operationKey: string): void {
    this.retryCount.delete(operationKey);
  }
}