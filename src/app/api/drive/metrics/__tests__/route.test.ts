import { NextRequest } from 'next/server';
import { GET } from '../route';
import { CacheManager } from '@/cache/CacheManager';

// Mock CacheManager
jest.mock('@/cache/CacheManager', () => ({
  getInstance: jest.fn(() => ({
    getStats: jest.fn(),
  })),
}));

describe('GET /api/drive/metrics', () => {
  let mockCacheManager: jest.Mocked<typeof CacheManager>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCacheManager = CacheManager as jest.Mocked<typeof CacheManager>;
  });

  it('returns cache metrics successfully', async () => {
    const mockMetrics = {
      hitRate: 95.5,
      size: 100,
      lastCleared: new Date().toISOString(),
      totalRequests: 1000,
      cacheSize: '1.2MB'
    };

    mockCacheManager.getInstance().getStats.mockReturnValueOnce(mockMetrics);

    const request = new NextRequest('http://localhost:3000/api/drive/metrics');
    const response = await GET(request);
    const data = await response.json();

    expect(mockCacheManager.getInstance().getStats).toHaveBeenCalled();
    expect(data).toEqual(mockMetrics);
    expect(response.status).toBe(200);
  });

  it('handles missing metrics gracefully', async () => {
    mockCacheManager.getInstance().getStats.mockReturnValueOnce({
      hitRate: 0,
      size: 0,
      lastCleared: new Date().toISOString()
    });

    const request = new NextRequest('http://localhost:3000/api/drive/metrics');
    const response = await GET(request);
    const data = await response.json();

    expect(data.hitRate).toBe(0);
    expect(data.size).toBe(0);
    expect(data.lastCleared).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('handles errors when getting metrics fails', async () => {
    mockCacheManager.getInstance().getStats.mockImplementationOnce(() => {
      throw new Error('Failed to get metrics');
    });

    const request = new NextRequest('http://localhost:3000/api/drive/metrics');
    const response = await GET(request);
    const data = await response.json();

    expect(data.error).toBe('Failed to get metrics');
    expect(response.status).toBe(500);
  });

  it('handles unexpected errors gracefully', async () => {
    mockCacheManager.getInstance().getStats.mockImplementationOnce(() => {
      throw new Error();
    });

    const request = new NextRequest('http://localhost:3000/api/drive/metrics');
    const response = await GET(request);
    const data = await response.json();

    expect(data.error).toBe('Error getting metrics');
    expect(response.status).toBe(500);
  });

  it('returns default metrics when values are invalid', async () => {
    const invalidMetrics = {
      hitRate: NaN,
      size: undefined,
      lastCleared: 'invalid-date'
    };

    mockCacheManager.getInstance().getStats.mockReturnValueOnce(invalidMetrics);

    const request = new NextRequest('http://localhost:3000/api/drive/metrics');
    const response = await GET(request);
    const data = await response.json();

    expect(data.hitRate).toBe(0);
    expect(data.size).toBe(0);
    expect(data.lastCleared).toBeDefined();
    expect(response.status).toBe(200);
  });
});