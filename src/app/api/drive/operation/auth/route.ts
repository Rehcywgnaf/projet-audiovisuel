import { NextResponse } from 'next/server';
import DriveConfig from '@/services/auth/DriveConfig';

export async function POST(request: Request) {
  try {
    const driveConfig = DriveConfig.getInstance();
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Auth code required' },
        { status: 400 }
      );
    }

    await driveConfig.authenticate(code);
    
    return NextResponse.json({
      isAuthenticated: true
    });
  } catch (error) {
    return NextResponse.json(
      { 
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      },
      { status: 500 }
    );
  }
}