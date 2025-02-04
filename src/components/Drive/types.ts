export interface FileMetadata {
  name: string;
  mimeType: string;
  parents?: string[];
  id?: string;
}

export interface DriveResponse {
  data: any;
  headers?: Record<string, string>;
  status?: number;
}

export interface DriveOperation {
  type: 'create' | 'read' | 'update' | 'delete';
  fileId?: string;
  content?: any;
  metadata?: FileMetadata;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
}