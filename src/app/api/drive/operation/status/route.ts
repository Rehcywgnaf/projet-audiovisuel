import { NextResponse } from 'next/server';
import DriveConfig from '@/core/drive/DriveConfig';

export async function GET() {
  try {
    const driveConfig = DriveConfig.getInstance();
    const isAuthenticated = driveConfig.getAccessToken() !== null;

    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    return NextResponse.json(
      { 
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Error checking auth status'
      },
      { status: 500 }
    );
  }
}