import DriveCore from './DriveCore';
import type { DriveOperation } from '../types';

export class DriveSync {
  private static instance: DriveSync;
  private syncQueue: DriveOperation[] = [];
  private driveCore: DriveCore;
  
  private constructor() {
    this.driveCore = DriveCore.getInstance();
  }

  public static getInstance(): DriveSync {
    if (!DriveSync.instance) {
      DriveSync.instance = new DriveSync();
    }
    return DriveSync.instance;
  }

  async addToQueue(operation: DriveOperation) {
    this.syncQueue.push(operation);
    await this.processQueue();
  }

  private async processQueue() {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue[0];
      try {
        await this.executeOperation(operation);
        this.syncQueue.shift(); // Remove processed operation
      } catch (error) {
        console.error('Erreur de synchronisation:', error);
        break;
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
}

export default DriveSync.getInstance();