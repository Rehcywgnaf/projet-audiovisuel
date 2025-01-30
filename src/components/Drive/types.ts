export interface DriveDocument {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: Date;
  size: number;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
  description?: string;
}

export interface DriveOperation {
  type: 'read' | 'write' | 'delete' | 'update';
  documentId: string;
  data?: any;
  timestamp: number;
}

export interface DriveError extends Error {
  code: string;
  details?: any;
}