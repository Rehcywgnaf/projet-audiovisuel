type AuthStatus = {
  isAuthenticated: boolean;
  error?: string;
};

type InitStatus = {
  initialized: boolean;
  error?: string;
};

class DriveAuthClient {
  private static instance: DriveAuthClient;

  private constructor() {}

  static getInstance(): DriveAuthClient {
    if (!DriveAuthClient.instance) {
      DriveAuthClient.instance = new DriveAuthClient();
    }
    return DriveAuthClient.instance;
  }

  async initialize(config: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }): Promise<InitStatus> {
    try {
      const response = await fetch('/api/drive/operation/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async authenticate(code: string): Promise<AuthStatus> {
    try {
      const response = await fetch('/api/drive/operation/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await fetch('/api/drive/operation/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      throw new Error(`Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAuthUrl(): Promise<string> {
    try {
      const response = await fetch('/api/drive/operation/auth-url');

      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error(`Auth URL error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default DriveAuthClient.getInstance();