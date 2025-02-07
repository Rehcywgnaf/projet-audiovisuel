import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DriveConfig } from '@/core/drive/DriveConfig';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const authCode = cookieStore.get('google_auth_code');
  
  if (!authCode?.value) {
    console.log('No auth code found in cookies');
    return NextResponse.json(
      { success: false, error: 'No auth code found' },
      { status: 400 }
    );
  }

  try {
    console.log('Processing authentication with auth code...');
    
    const driveConfig = DriveConfig.getInstance();
    await driveConfig.initialize({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/drive/auth/callback'
    });

    // On récupère le token
    const token = await driveConfig.authenticateAndGetToken(authCode.value);
    console.log('Authentication successful, token received');

    // Suppression immédiate du cookie après utilisation
    const response = NextResponse.json({ success: true, token });
    response.cookies.delete('google_auth_code');
    
    return response;
  } catch (error) {
    console.error('Error handling authentication:', error);
    
    // Suppression du cookie en cas d'erreur
    const response = NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed'
      },
      { status: 500 }
    );
    response.cookies.delete('google_auth_code');
    
    return response;
  }
}