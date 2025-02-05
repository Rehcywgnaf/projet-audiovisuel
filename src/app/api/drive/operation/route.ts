import { NextResponse } from 'next/server';
import DriveCore from '@/components/Drive/Core/DriveCore';
import DriveSync from '@/components/Drive/Core/DriveSync';

export async function POST(request: Request) {
  try {
    const operation = await request.json();
    const driveSync = DriveSync.getInstance();
    
    const result = await driveSync.addToQueue(operation);
    
    return NextResponse.json({ 
      success: true, 
      data: result 
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