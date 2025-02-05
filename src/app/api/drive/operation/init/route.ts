import { NextResponse } from 'next/server';
import { DriveConfig } from '@/components/Drive/Core/DriveConfig';

export async function POST(request: Request) {
  try {
    const config = await request.json();
    const driveConfig = DriveConfig.getInstance();
    
    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      return NextResponse.json(
        { error: 'Missing required configuration' },
        { status: 400 }
      );
    }

    await driveConfig.initialize(config);
    
    return NextResponse.json({
      initialized: true
    });
  } catch (error) {
    return NextResponse.json(
      { 
        initialized: false,
        error: error instanceof Error ? error.message : 'Initialization failed'
      },
      { status: 500 }
    );
  }
}