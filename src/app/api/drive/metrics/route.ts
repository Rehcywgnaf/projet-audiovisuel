import { NextResponse } from 'next/server';
import { driveSync } from '@/components/Drive/Core/DriveSync';
import { CacheManager } from '@/cache/CacheManager';

export async function GET(request: Request) {
  try {
    const status = await driveSync.getStatus();
    const cacheStats = CacheManager.getInstance().getStats();
    
    return NextResponse.json({
      size: cacheStats.size,
      lowPriority: cacheStats.lowPriority,
      mediumPriority: cacheStats.mediumPriority,
      highPriority: cacheStats.highPriority,
      syncStatus: status
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}