import { NextResponse } from 'next/server';
import { DriveConfig } from '@/components/Drive/Core/DriveConfig';

export async function POST() {
  try {
    const driveConfig = DriveConfig.getInstance();
    driveConfig.logout();
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      },
      { status: 500 }
    );
  }
}