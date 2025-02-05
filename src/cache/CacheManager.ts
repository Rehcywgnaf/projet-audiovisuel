import { CacheConfig, FileMetadata, DriveResponse } from '../types';
import  EventSystem  from '../core/EventSystem';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  size: number;
}

interface CacheStore {
  files: Map<string, CacheEntry<DriveResponse>>;
  metadata: Map<string, CacheEntry<FileMetadata>>;
  folders: Map<string, CacheEntry<string[]>>;
}

class CacheManager {
  private static instance: CacheManager;
  private eventSystem: EventSystem;
  private store: CacheStore;
  private config: CacheConfig = {
    enabled: true,
    ttl: 3600, // 1 hour default TTL
    maxSize: 100 // 100MB default max size
  };

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.store = {
      files: new Map(),
      metadata: new Map(),
      folders: new Map()
    };
    this.initializeEventListeners();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private initializeEventListeners(): void {
    this.eventSystem.on('driveFileUpdated', ({ fileId }) => {
      this.invalidateFile(fileId);
    });

    this.eventSystem.on('driveFolderUpdated', ({ folderId }) => {
      this.invalidateFolder(folderId);
    });
  }

  configure(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    this.cleanup();
  }

  async getFile(fileId: string): Promise<DriveResponse | null> {
    if (!this.config.enabled) return null;

    const cached = this.store.files.get(fileId);
    if (!cached) return null;

    if (this.isExpired(cached.timestamp)) {
      this.store.files.delete(fileId);
      return null;
    }

    return cached.data;
  }

  async setFile(fileId: string, data: DriveResponse): Promise<void> {
    if (!this.config.enabled) return;

    const size = this.calculateSize(data);
    if (size > this.config.maxSize) return;

    await this.ensureSpace(size);
    this.store.files.set(fileId, {
      data,
      timestamp: Date.now(),
      size
    });
  }

  async getMetadata(fileId: string): Promise<FileMetadata | null> {
    if (!this.config.enabled) return null;

    const cached = this.store.metadata.get(fileId);
    if (!cached) return null;

    if (this.isExpired(cached.timestamp)) {
      this.store.metadata.delete(fileId);
      return null;
    }

    return cached.data;
  }

  async setMetadata(fileId: string, data: FileMetadata): Promise<void> {
    if (!this.config.enabled) return;

    const size = this.calculateSize(data);
    await this.ensureSpace(size);
    
    this.store.metadata.set(fileId, {
      data,
      timestamp: Date.now(),
      size
    });
  }

  async invalidateFile(fileId: string): Promise<void> {
    this.store.files.delete(fileId);
    this.store.metadata.delete(fileId);
  }

  async invalidateFolder(folderId: string): Promise<void> {
    this.store.folders.delete(folderId);
  }

  clear(): void {
    this.store.files.clear();
    this.store.metadata.clear();
    this.store.folders.clear();
  }

  private isExpired(timestamp: number): boolean {
    const age = Date.now() - timestamp;
    return age > this.config.ttl * 1000;
  }

  private calculateSize(data: any): number {
    return new TextEncoder().encode(JSON.stringify(data)).length;
  }

  private async ensureSpace(requiredSize: number): Promise<void> {
    let currentSize = 0;
    const entries: [string, CacheEntry<any>][] = [];

    for (const [store, map] of Object.entries(this.store)) {
      for (const [key, entry] of map.entries()) {
        currentSize += entry.size;
        entries.push([key, entry]);
      }
    }

    if (currentSize + requiredSize > this.config.maxSize * 1024 * 1024) {
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      while (currentSize + requiredSize > this.config.maxSize * 1024 * 1024 && entries.length > 0) {
        const [key, entry] = entries.shift()!;
        currentSize -= entry.size;
        
        for (const map of Object.values(this.store)) {
          map.delete(key);
        }
      }
    }
  }

  private cleanup(): void {
    const now = Date.now();

    for (const map of Object.values(this.store)) {
      for (const [key, entry] of map.entries()) {
        if (this.isExpired(entry.timestamp)) {
          map.delete(key);
        }
      }
    }
  }

  getStats(): {
    filesCount: number;
    metadataCount: number;
    foldersCount: number;
    totalSize: number;
  } {
    let totalSize = 0;
    for (const map of Object.values(this.store)) {
      for (const entry of map.values()) {
        totalSize += entry.size;
      }
    }

    return {
      filesCount: this.store.files.size,
      metadataCount: this.store.metadata.size,
      foldersCount: this.store.folders.size,
      totalSize
    };
  }
}

export default CacheManager;