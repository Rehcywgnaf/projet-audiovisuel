import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Gérer le retour de l'authentification Google
  if (request.nextUrl.pathname === '/drive/auth/callback') {
    const code = request.nextUrl.searchParams.get('code');
    if (code) {
      const response = NextResponse.redirect(new URL('/?auth=true', request.url));
      response.cookies.set('google_auth_code', code, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 5 // 5 minutes
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/drive/auth/callback'
};