import { NextResponse } from 'next/server';
import DriveSync from '@/components/Drive/Core/DriveSync';

export async function GET(request: Request) {
  try {
    const driveSync = DriveSync.getInstance();
    const status = await driveSync.getStatus();
    
    return NextResponse.json(status);
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