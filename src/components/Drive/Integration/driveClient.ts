type DriveOperation = {
  type: 'create' | 'read' | 'update' | 'delete';
  fileId?: string;
  content?: any;
  metadata?: {
    name: string;
    folderId?: string;
  };
};

type SyncStatus = {
  status: 'idle' | 'syncing' | 'error' | 'success';
  message?: string;
  lastSync?: Date;
};

type CacheMetrics = {
  hitRate: number;
  size: number;
  lastCleared: Date;
};

class DriveClient {
  private static instance: DriveClient;

  private constructor() {}

  static getInstance(): DriveClient {
    if (!DriveClient.instance) {
      DriveClient.instance = new DriveClient();
    }
    return DriveClient.instance;
  }

  async sync(): Promise<SyncStatus> {
    try {
      const response = await fetch('/api/drive/sync', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Sync error: ${error.message}`);
    }
  }

  async getCacheMetrics(): Promise<CacheMetrics> {
    try {
      const response = await fetch('/api/drive/metrics');
      
      if (!response.ok) {
        throw new Error('Failed to get metrics');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Metrics error: ${error.message}`);
    }
  }

  async executeOperation(operation: DriveOperation): Promise<any> {
    try {
      const response = await fetch('/api/drive/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      });

      if (!response.ok) {
        throw new Error('Operation failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Operation error: ${error.message}`);
    }
  }
}

export default DriveClient.getInstance();