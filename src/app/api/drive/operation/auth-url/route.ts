import { NextResponse } from 'next/server';
import { DriveConfig } from '@/core/drive/DriveConfig';

export async function GET() {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing credentials in environment variables');
      return NextResponse.json(
        { error: 'Configuration error - missing credentials' },
        { status: 500 }
      );
    }

    const driveConfig = DriveConfig.getInstance();

    // Initialisation sans vérification du token pour obtenir juste l'URL d'auth
    await driveConfig.initialize({
      clientId,
      clientSecret,
      redirectUri
    }, false);

    const authUrl = driveConfig.getAuthUrl();
    return NextResponse.json({ url: authUrl });

  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error generating auth URL',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}