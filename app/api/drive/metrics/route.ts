import { NextResponse } from 'next/server';
import DriveSync from '@/components/Drive/Core/DriveSync';
import { CacheManager } from '@/components/Drive/Core/CacheManager';

export async function GET(request: Request) {
  try {
    const driveSync = DriveSync.getInstance();
    const cacheManager = CacheManager.getInstance();
    const status = await driveSync.getStatus();
    const cacheStats = cacheManager.getStats();
    
    return NextResponse.json({
      hitRate: cacheStats.hitRate,
      size: cacheStats.size,
      lastCleared: cacheStats.lastUpdated,
      syncStatus: status
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}