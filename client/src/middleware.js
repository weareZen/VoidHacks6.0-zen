import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token') || request.headers.get('Authorization');
  const isPublicPath = request.nextUrl.pathname === '/login';

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access login page
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard',
    '/users',
    '/verify',
    '/reports',
    '/settings',
    '/students',
    '/evaluate',
    '/upload-reports',
    '/certificates',
    '/chat'
  ]
}; 