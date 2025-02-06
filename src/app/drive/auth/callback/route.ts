import { NextResponse } from 'next/server';
import { DriveConfig } from '@/core/drive/DriveConfig';
import { TokenStorage } from '@/core/drive/TokenStorage';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      console.error('No authorization code provided');
      return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    // Récupération des credentials
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/drive/auth/callback';

    // Vérification des credentials
    if (!clientId || !clientSecret) {
      console.error('Missing credentials:', { hasClientId: !!clientId, hasClientSecret: !!clientSecret });
      return NextResponse.redirect(new URL('/?error=missing_credentials', request.url));
    }

    console.log('Starting authentication process...');

    // Initialisation du DriveConfig
    const driveConfig = DriveConfig.getInstance();
    await driveConfig.initialize({
      clientId,
      clientSecret,
      redirectUri
    }, false);

    // Authentification avec le code
    console.log('Authenticating with code...');
    await driveConfig.authenticate(code);
    
    console.log('Authentication successful, checking stored token...');
    const storedToken = await TokenStorage.getStoredToken();
    console.log('Stored token:', !!storedToken);

    // On ajoute le token dans les cookies pour la persistance côté client
    const response = NextResponse.redirect(new URL('/?status=success', request.url));
    response.cookies.set('auth_success', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 heures
    });
    
    return response;

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error instanceof Error ? error.message : 'Authentication failed')}`, request.url)
    );
  }
}