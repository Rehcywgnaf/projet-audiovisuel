import { NextResponse } from 'next/server';
import { DriveAuthHandler } from './DriveAuthHandler';

export async function GET(request: Request) {
  try {
    const response = await DriveAuthHandler.handleAuth(request as any, NextResponse as any);
    return response;
  } catch (error) {
    console.error('Erreur de route auth:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const response = await DriveAuthHandler.refreshToken(request as any, NextResponse as any);
    return response;
  } catch (error) {
    console.error('Erreur de route refresh:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}