import { NextResponse } from 'next/server';
import { DriveConfig } from '@/core/drive/DriveConfig';

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

    // Initialisation du DriveConfig
    const driveConfig = DriveConfig.getInstance();
    await driveConfig.initialize({
      clientId,
      clientSecret,
      redirectUri
    }, false);

    // Authentification avec le code
    await driveConfig.authenticate(code);
    
    // Redirection vers la page principale en cas de succès
    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    console.error('Callback error:', error);
    // Redirection avec message d'erreur en cas d'échec
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error instanceof Error ? error.message : 'Authentication failed')}`, request.url)
    );
  }
}