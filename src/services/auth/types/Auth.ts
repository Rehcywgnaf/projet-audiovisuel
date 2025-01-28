export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastRefresh: number | null;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresAt: number;
  type: string;
}

export type AuthError =
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_EXPIRED_TOKEN'
  | 'AUTH_NETWORK_ERROR'
  | 'AUTH_USER_CANCELLED'
  | 'AUTH_INVALID_STATE';

export interface AuthOptions {
  autoRefresh?: boolean;
  refreshThreshold?: number; // Minutes before expiry to trigger refresh
  maxRetries?: number;
}