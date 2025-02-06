import { NextResponse } from 'next/server';
import DriveConfig from '@/services/auth/DriveConfig';

export async function GET() {
  try {
    const driveConfig = DriveConfig.getInstance();
    const isAuthenticated = driveConfig.getAccessToken() !== null;

    return NextResponse.json({ 
      isAuthenticated,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error checking auth status'
      },
      { status: 500 }
    );
  }
}