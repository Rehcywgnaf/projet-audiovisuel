import type { DriveOperation } from '../types';

export type SyncStatus = {
  lastSync: string | null;
  nextSync: string | null;
  status: 'active' | 'inactive' | 'error';
  currentOperation: string | null;
};

type QueueOperationResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

class DriveSyncClient {
  private static instance: DriveSyncClient;

  private constructor() {}

  static getInstance(): DriveSyncClient {
    if (!DriveSyncClient.instance) {
      DriveSyncClient.instance = new DriveSyncClient();
    }
    return DriveSyncClient.instance;
  }

  async addToQueue(operation: DriveOperation): Promise<QueueOperationResponse> {
    try {
      const response = await fetch('/api/drive/sync/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout à la queue');
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getStatus(): Promise<SyncStatus> {
    try {
      const response = await fetch('/api/drive/sync/status');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du statut');
      }

      return await response.json();
    } catch (error) {
      return {
        lastSync: null,
        nextSync: null,
        status: 'error',
        currentOperation: null
      };
    }
  }
}

export default DriveSyncClient.getInstance();