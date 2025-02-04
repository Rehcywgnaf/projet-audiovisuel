import { DriveCore } from './DriveCore';
import { ErrorHandling } from '../error/ErrorHandling';
import { DriveOperation } from '../types';

export class DriveSync {
  private static instance: DriveSync;
  private syncQueue: DriveOperation[] = [];
  private processing: boolean = false;
  private driveCore: DriveCore;
  private errorHandler: ErrorHandling;

  private constructor() {
    this.driveCore = DriveCore.getInstance();
    this.errorHandler = ErrorHandling.getInstance();
  }

  public static getInstance(): DriveSync {
    if (!DriveSync.instance) {
      DriveSync.instance = new DriveSync();
    }
    return DriveSync.instance;
  }

  async addToQueue(operation: DriveOperation): Promise<void> {
    this.syncQueue.push(operation);
    if (!this.processing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.syncQueue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      while (this.syncQueue.length > 0) {
        const operation = this.syncQueue[0];
        await this.executeOperation(operation);
        this.syncQueue.shift();
      }
    } catch (error) {
      this.errorHandler.handleError('SYNC_PROCESS_ERROR', error);
    } finally {
      this.processing = false;
    }
  }

  private async executeOperation(operation: DriveOperation): Promise<any> {
    try {
      return await this.driveCore.executeOperation(operation);
    } catch (error) {
      throw this.errorHandler.handleError('SYNC_OPERATION_ERROR', error);
    }
  }

  async synchronize(): Promise<void> {
    if (this.syncQueue.length > 0) {
      await this.processQueue();
    }
  }

  getQueueLength(): number {
    return this.syncQueue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }

  clearQueue(): void {
    this.syncQueue = [];
    this.processing = false;
  }
}

export default DriveSync.getInstance();