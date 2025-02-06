import { NextResponse } from 'next/server';
import { DriveConfig } from '@/core/drive/DriveConfig';

export async function GET(request: Request) {
  try {
    // Récupération du code d'autorisation depuis l'URL
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      console.error('No authorization code provided');
      return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    // Initialisation et authentification
    const driveConfig = DriveConfig.getInstance();
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