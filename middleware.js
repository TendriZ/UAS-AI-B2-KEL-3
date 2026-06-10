/**
 * Next.js Middleware
 * Protects routes that require authentication
 */

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth.js';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/history', '/tambak', '/profile'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated
  const user = await getAuthUser();

  // Redirect protected routes to login if not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
