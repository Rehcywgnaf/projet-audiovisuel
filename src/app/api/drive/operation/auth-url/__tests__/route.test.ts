import { NextRequest } from 'next/server';
import { GET } from '../route';
import DriveConfig from '@/services/auth/DriveConfig';

// Mock DriveConfig
jest.mock('@/services/auth/DriveConfig', () => ({
  getInstance: jest.fn(() => ({
    getAuthUrl: jest.fn(),
  })),
}));

describe('GET /api/drive/operation/auth-url', () => {
  let mockDriveConfig: jest.Mocked<typeof DriveConfig>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDriveConfig = DriveConfig as jest.Mocked<typeof DriveConfig>;
  });

  it('returns the authentication URL successfully', async () => {
    const mockAuthUrl = 'https://google.com/auth';
    mockDriveConfig.getInstance().getAuthUrl.mockReturnValueOnce(mockAuthUrl);

    const request = new NextRequest('http://localhost:3000/api/drive/operation/auth-url');
    const response = await GET(request);
    const data = await response.json();

    expect(mockDriveConfig.getInstance().getAuthUrl).toHaveBeenCalled();
    expect(data.url).toBe(mockAuthUrl);
    expect(response.status).toBe(200);
  });

  it('handles errors when getting auth URL fails', async () => {
    const error = new Error('Failed to generate auth URL');
    mockDriveConfig.getInstance().getAuthUrl.mockImplementationOnce(() => {
      throw error;
    });

    const request = new NextRequest('http://localhost:3000/api/drive/operation/auth-url');
    const response = await GET(request);
    const data = await response.json();

    expect(data.error).toBe('Failed to generate auth URL');
    expect(response.status).toBe(500);
  });

  it('handles unexpected errors gracefully', async () => {
    mockDriveConfig.getInstance().getAuthUrl.mockImplementationOnce(() => {
      throw new Error();
    });

    const request = new NextRequest('http://localhost:3000/api/drive/operation/auth-url');
    const response = await GET(request);
    const data = await response.json();

    expect(data.error).toBe('Error getting auth URL');
    expect(response.status).toBe(500);
  });
});