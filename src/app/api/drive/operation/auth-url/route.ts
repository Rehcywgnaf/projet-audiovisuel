import { NextResponse } from 'next/server';
import DriveConfig from '@/services/auth/DriveConfig';

export async function GET() {
  try {
    const driveConfig = DriveConfig.getInstance();
    const authUrl = driveConfig.getAuthUrl();
    
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error getting auth URL'
      },
      { status: 500 }
    );
  }
}