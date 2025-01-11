import DriveCore from './DriveCore';
import { SyncStatus, SyncOperation } from '../types';

class DriveSync {
  private static instance: DriveSync;
  private driveCore: DriveCore;
  private syncQueue: SyncOperation[] = [];
  private syncStatus: Map<string, SyncStatus> = new Map();

  private constructor() {
    this.driveCore = DriveCore.getInstance();
  }

  static getInstance(): DriveSync {
    if (!DriveSync.instance) {
      DriveSync.instance = new DriveSync();
    }
    return DriveSync.instance;
  }

  async queueOperation(operation: SyncOperation): Promise<void> {
    this.syncQueue.push(operation);
    this.updateStatus(operation.fileId, 'pending');
    await this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return;

    const operation = this.syncQueue[0];
    try {
      await this.driveCore.executeOperation(operation);
      this.updateStatus(operation.fileId, 'synced');
      this.syncQueue.shift();
    } catch (error) {
      this.updateStatus(operation.fileId, 'error');
    }
  }

  private updateStatus(fileId: string, status: SyncStatus): void {
    this.syncStatus.set(fileId, status);
  }

  async getSyncStatus(fileId: string): Promise<SyncStatus> {
    return this.syncStatus.get(fileId) || 'unknown';
  }

  async resolveConflict(fileId: string, resolution: 'local' | 'remote'): Promise<void> {
    const metadata = await this.driveCore.getFileMetadata(fileId);
    // Logique de résolution sans vérification de permissions
  }

  async getChanges(fileId: string): Promise<any[]> {
    // Récupération pure des changements
    return [];
  }
}