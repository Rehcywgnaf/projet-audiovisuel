import { NextResponse } from 'next/server';
import DriveConfig from '@/core/drive/DriveConfig';

export async function GET() {
  try {
    console.log('Initialisation de DriveConfig...');
    const driveConfig = DriveConfig.getInstance();
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    
    console.log('Credentials disponibles:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri
    });

    await driveConfig.initialize({
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      redirectUri: redirectUri || ''
    });
    
    console.log('DriveConfig initialisé avec succès');
    const authUrl = driveConfig.getAuthUrl();
    console.log('URL d\'authentification générée avec succès');
    
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error getting auth URL',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}