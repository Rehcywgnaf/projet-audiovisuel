import { NextRequest } from 'next/server';
import { POST } from '../route';
import DriveSync from '@/components/Drive/Core/DriveSync';

// Mock DriveSync
jest.mock('@/components/Drive/Core/DriveSync', () => ({
  getInstance: jest.fn(() => ({
    getStatus: jest.fn(),
  })),
}));

describe('POST /api/drive/sync/status', () => {
  let mockDriveSync: jest.Mocked<typeof DriveSync>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDriveSync = DriveSync as jest.Mocked<typeof DriveSync>;
  });

  it('returns current sync status successfully', async () => {
    const mockStatus = {
      status: 'active',
      lastSync: new Date().toISOString(),
      nextSync: new Date().toISOString(),
      currentOperation: 'sync'
    };

    mockDriveSync.getInstance().getStatus.mockResolvedValueOnce(mockStatus);

    const request = new NextRequest('http://localhost:3000/api/drive/sync/status', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockDriveSync.getInstance().getStatus).toHaveBeenCalled();
    expect(data.success).toBe(true);
    expect(data.status).toEqual(mockStatus);
    expect(response.status).toBe(200);
  });

  it('handles sync status error', async () => {
    mockDriveSync.getInstance().getStatus.mockRejectedValueOnce(
      new Error('Sync error: operation in progress')
    );

    const request = new NextRequest('http://localhost:3000/api/drive/sync/status', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Sync error: operation in progress');
    expect(response.status).toBe(500);
  });

  it('handles unexpected errors gracefully', async () => {
    mockDriveSync.getInstance().getStatus.mockRejectedValueOnce(new Error());

    const request = new NextRequest('http://localhost:3000/api/drive/sync/status', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Error getting sync status');
    expect(response.status).toBe(500);
  });

  it('handles status with missing fields', async () => {
    const incompleteStatus = {
      status: 'active'
      // lastSync et nextSync manquants
    };

    mockDriveSync.getInstance().getStatus.mockResolvedValueOnce(incompleteStatus);

    const request = new NextRequest('http://localhost:3000/api/drive/sync/status', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.status).toEqual(incompleteStatus);
    expect(response.status).toBe(200);
  });
});