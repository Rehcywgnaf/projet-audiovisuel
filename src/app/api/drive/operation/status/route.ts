import { NextResponse } from 'next/server';
import DriveConfig from '@/core/drive/DriveConfig';
import { TokenStorage } from '@/core/drive/TokenStorage';

export async function GET() {
  try {
    const token = await TokenStorage.getStoredToken();
    const isAuthenticated = token !== null && !TokenStorage.isTokenExpired(token);

    return NextResponse.json({ isAuthenticated });
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