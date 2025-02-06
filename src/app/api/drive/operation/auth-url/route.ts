import { NextResponse } from 'next/server';
import DriveConfig from '@/core/drive/DriveConfig';

export async function GET() {
  try {
    const driveConfig = DriveConfig.getInstance();
    await driveConfig.initialize({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || ''
    });
    
    const authUrl = driveConfig.getAuthUrl();
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error getting auth URL'
      },
      { status: 500 }
    );
  }
}