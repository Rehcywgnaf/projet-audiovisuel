import { NextRequest } from 'next/server';
import { POST } from '../route';
import DriveConfig from '@/services/auth/DriveConfig';

// Mock DriveConfig
jest.mock('@/services/auth/DriveConfig', () => ({
  getInstance: jest.fn(() => ({
    logout: jest.fn(),
  })),
}));

describe('POST /api/drive/operation/logout', () => {
  let mockDriveConfig: jest.Mocked<typeof DriveConfig>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDriveConfig = DriveConfig as jest.Mocked<typeof DriveConfig>;
  });

  it('handles logout successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/drive/operation/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockDriveConfig.getInstance().logout).toHaveBeenCalled();
    expect(data.success).toBe(true);
    expect(response.status).toBe(200);
  });

  it('handles logout failure', async () => {
    const error = new Error('Logout failed');
    mockDriveConfig.getInstance().logout.mockImplementationOnce(() => {
      throw error;
    });

    const request = new NextRequest('http://localhost:3000/api/drive/operation/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Logout failed');
    expect(response.status).toBe(500);
  });

  it('handles unexpected errors gracefully', async () => {
    mockDriveConfig.getInstance().logout.mockImplementationOnce(() => {
      throw new Error();
    });

    const request = new NextRequest('http://localhost:3000/api/drive/operation/logout', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Logout failed');
    expect(response.status).toBe(500);
  });
});