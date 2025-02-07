import { NextResponse } from 'next/server';
import { DriveConfig } from '@/core/drive/DriveConfig';
import { TokenStorage } from '@/core/drive/TokenStorage';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('Checking authentication status...');
    
    // Vérifier le token stocké
    const token = await TokenStorage.getStoredToken();
    console.log('Token found:', !!token);
    
    if (!token) {
      console.log('No token found, returning false');
      return NextResponse.json({ isAuthenticated: false });
    }

    // Vérifier l'expiration du token
    if (TokenStorage.isTokenExpired(token)) {
      console.log('Token is expired');
      return NextResponse.json({ isAuthenticated: false });
    }

    // Initialiser DriveConfig avec le token existant
    try {
      console.log('Initializing DriveConfig...');
      const driveConfig = DriveConfig.getInstance();
      await driveConfig.initialize({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/drive/auth/callback'
      });
      
      console.log('DriveConfig initialized successfully');
      return NextResponse.json({ isAuthenticated: true });
    } catch (error) {
      console.error('Error initializing DriveConfig:', error);
      return NextResponse.json({ isAuthenticated: false });
    }

  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Error checking auth status'
      },
      { status: 500 }
    );
  }
}