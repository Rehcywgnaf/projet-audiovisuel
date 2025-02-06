import { NextRequest } from 'next/server';
import { POST } from '../route';
import DriveConfig from '@/services/auth/DriveConfig';

// Mock DriveConfig
jest.mock('@/services/auth/DriveConfig', () => ({
  getInstance: jest.fn(() => ({
    authenticate: jest.fn(),
  })),
}));

describe('POST /api/drive/operation/auth', () => {
  let mockDriveConfig: jest.Mocked<typeof DriveConfig>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDriveConfig = DriveConfig as jest.Mocked<typeof DriveConfig>;
  });

  it('handles valid authentication code', async () => {
    const request = new NextRequest('http://localhost:3000/api/drive/operation/auth', {
      method: 'POST',
      body: JSON.stringify({ code: 'valid-auth-code' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockDriveConfig.getInstance().authenticate).toHaveBeenCalledWith('valid-auth-code');
    expect(data.isAuthenticated).toBe(true);
    expect(response.status).toBe(200);
  });

  it('returns 400 when code is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/drive/operation/auth', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.error).toBe('Auth code required');
    expect(response.status).toBe(400);
  });

  it('handles authentication failure', async () => {
    const error = new Error('Authentication failed');
    mockDriveConfig.getInstance().authenticate.mockRejectedValueOnce(error);

    const request = new NextRequest('http://localhost:3000/api/drive/operation/auth', {
      method: 'POST',
      body: JSON.stringify({ code: 'invalid-code' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.isAuthenticated).toBe(false);
    expect(data.error).toBe('Authentication failed');
    expect(response.status).toBe(500);
  });

  it('handles malformed request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/drive/operation/auth', {
      method: 'POST',
      body: 'invalid-json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.error).toBeTruthy();
    expect(response.status).toBe(500);
  });
});