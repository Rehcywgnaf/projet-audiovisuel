import { NextResponse } from 'next/server';
import { DriveConfig } from '@/core/drive/DriveConfig';

export async function POST(request: Request) {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/drive/auth/callback';

    if (!clientId || !clientSecret) {
      console.error('Variables d\'environnement manquantes:', {
        hasClientId: !!clientId,
        hasApplicationCredentials: !!clientSecret,
        redirectUri
      });
      return NextResponse.json(
        { error: 'Configuration error - missing credentials' },
        { status: 500 }
      );
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { error: 'Auth code required' },
        { status: 400 }
      );
    }

    const driveConfig = DriveConfig.getInstance();
    
    // Initialisation avec les credentials
    await driveConfig.initialize({
      clientId,
      clientSecret,
      redirectUri
    });

    // Authentification avec le code
    await driveConfig.authenticate(code);
    
    return NextResponse.json({
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
        details: error instanceof Error ? error.stack : undefined,
        env: {
          hasClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          hasApplicationCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
          redirectUri: process.env.GOOGLE_REDIRECT_URI
        }
      },
      { status: 500 }
    );
  }
}