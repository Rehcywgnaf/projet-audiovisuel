export interface DriveOperation {
  type: 'create' | 'read' | 'update' | 'delete';
  fileId?: string;
  content?: any;
  metadata?: {
    name: string;
    folderId?: string;
    mimeType?: string;
  };
}

export interface FileMetadata {
  id?: string;
  name: string;
  mimeType?: string;
  parents?: string[];
  modifiedTime?: string;
  size?: string;
  version?: string;
  webViewLink?: string;
  permissions?: DrivePermission[];
}

export interface DrivePermission {
  id: string;
  type: 'user' | 'group' | 'domain' | 'anyone';
  emailAddress?: string;
  role: 'owner' | 'writer' | 'reader';
  displayName?: string;
}

export interface DriveResponse {
  data: any;
  status: number;
  headers: any;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum cache size in MB
}