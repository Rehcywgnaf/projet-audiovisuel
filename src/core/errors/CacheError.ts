export enum CacheErrorType {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  STORAGE_FULL = 'STORAGE_FULL',
  INVALID_DATA = 'INVALID_DATA',
  WRITE_ERROR = 'WRITE_ERROR',
  READ_ERROR = 'READ_ERROR',
  EXPIRED_DATA = 'EXPIRED_DATA',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED'
}

export class CacheError extends Error {
  constructor(
    public readonly type: CacheErrorType,
    public readonly details: any = {},
    message?: string
  ) {
    super(message || `Cache error: ${type}`);
    this.name = 'CacheError';
  }
}