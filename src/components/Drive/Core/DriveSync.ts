import DriveCore from './DriveCore';
import type { DriveOperation } from '../types';
import { CacheManager, CachePriority } from '@/cache/CacheManager';

export class DriveSync {
  private static instance: DriveSync;
  private syncQueue: DriveOperation[] = [];
  private driveCore: DriveCore;
  private cacheManager: CacheManager;
  
  private constructor() {
    this.driveCore = DriveCore.getInstance();
    this.cacheManager = CacheManager.getInstance();
  }

  public static getInstance(): DriveSync {
    if (!DriveSync.instance) {
      DriveSync.instance = new DriveSync();
    }
    return DriveSync.instance;
  }

  async addToQueue(operation: DriveOperation) {
    // Vérification du cache avant ajout à la queue
    const cacheKey = `drive_op_${operation.type}_${JSON.stringify(operation)}`;
    const cachedResult = await this.cacheManager.get(cacheKey, CachePriority.HIGH);
    
    if (cachedResult) {
      return cachedResult;
    }

    this.syncQueue.push(operation);
    const result = await this.processQueue();
    
    // Mise en cache du résultat
    await this.cacheManager.set(cacheKey, result, CachePriority.HIGH);
    
    return result;
  }

  private async processQueue() {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue[0];
      try {
        const result = await this.executeOperation(operation);
        this.syncQueue.shift(); // Remove processed operation
        return result;
      } catch (error) {
        console.error('Erreur de synchronisation:', error);
        throw error;
      }
    }
  }

  private async executeOperation(operation: DriveOperation) {
    try {
      return await this.driveCore.executeOperation(operation);
    } catch (error) {
      throw new Error(`Erreur lors de l'exécution de l'opération: ${error.message}`);
    }
  }

  async getStatus(): Promise<{
    lastSync: string | null;
    nextSync: string | null;
    status: 'active' | 'inactive' | 'error';
    currentOperation: string | null;
  }> {
    const cacheStats = this.cacheManager.getStats();
    const queueActive = this.syncQueue.length > 0;
    
    return {
      lastSync: queueActive ? new Date().toISOString() : null,
      nextSync: queueActive ? new Date(Date.now() + 60000).toISOString() : null,
      status: queueActive ? 'active' : 'inactive',
      currentOperation: queueActive ? this.syncQueue[0].type : null
    };
  }
}

export default DriveSync.getInstance();