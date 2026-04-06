import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    // Skip middleware for login page itself
    if (pathname === '/admin') {
      return NextResponse.next();
    }

    // Check for admin authentication cookie
    const adminCookie = request.cookies.get('admin_authenticated');

    // If not authenticated and trying to access protected routes
    if (!adminCookie) {
      // Redirect to admin login page
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all admin routes except login
    '/admin/:path*',
  ],
};
