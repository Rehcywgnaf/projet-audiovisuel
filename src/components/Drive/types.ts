export type DriveOperationType = 'list' | 'get' | 'create' | 'update' | 'delete';

export interface DriveOperation {
  type: DriveOperationType;
  fileId?: string;
  name?: string;
  mimeType?: string;
  parents?: string[];
  media?: {
    mimeType: string;
    body: any;
  };
  pageSize?: number;
}