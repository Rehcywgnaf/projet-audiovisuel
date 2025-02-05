import { NextResponse } from 'next/server';
import DriveSync from '@/components/Drive/Core/DriveSync';

export async function POST(request: Request) {
  try {
    const driveSync = DriveSync.getInstance();
    const status = await driveSync.getStatus();
    
    if (status.status === 'error') {
      throw new Error('Sync error: ' + status.currentOperation);
    }

    return NextResponse.json({ 
      success: true, 
      status: status 
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