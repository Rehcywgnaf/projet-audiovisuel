import { DriveCore } from './DriveCore';

export class DriveSync {
  private static instance: DriveSync;
  private syncQueue: Array<any> = [];
  private driveCore: DriveCore;
  
  private constructor() {
    this.driveCore = new DriveCore();
  }

  public static getInstance(): DriveSync {
    if (!DriveSync.instance) {
      DriveSync.instance = new DriveSync();
    }
    return DriveSync.instance;
  }

  async addToQueue(operation: any) {
    this.syncQueue.push(operation);
    await this.processQueue();
  }

  private async processQueue() {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue[0];
      try {
        await this.executeOperation(operation);
        this.syncQueue.shift();
      } catch (error) {
        console.error('Sync error:', error);
        break;
      }
    }
  }

  private async executeOperation(operation: any) {
    switch(operation.type) {
      case 'upload':
        return await this.driveCore.uploadFile(operation.data);
      case 'update':
        return await this.driveCore.updateFile(operation.data);
      case 'delete':
        return await this.driveCore.deleteFile(operation.data);
      default:
        throw new Error('Unknown operation type');
    }
  }

  async synchronize() {
    return this.processQueue();
  }
}

export default DriveSync.getInstance();