import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DriveConfig } from '@/core/drive/DriveConfig';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authCode = cookieStore.get('google_auth_code');
    
    if (!authCode) {
      console.log('No auth code found in cookies');
      return NextResponse.json({ success: false, error: 'No auth code found' });
    }

    console.log('Processing authentication with code from cookie');
    const driveConfig = DriveConfig.getInstance();
    await driveConfig.initialize({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/drive/auth/callback'
    });

    const token = await driveConfig.authenticateAndGetToken(authCode.value);
    console.log('Authentication successful');

    // Supprimer le cookie après utilisation
    const response = NextResponse.json({ 
      success: true,
      token
    });
    response.cookies.set('google_auth_code', '', { maxAge: 0 });
    
    return response;
  } catch (error) {
    console.error('Error handling authentication:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed'
      },
      { status: 500 }
    );
  }
}