import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization');
  const isPublicPath = request.nextUrl.pathname === '/login';
  const url = request.nextUrl.clone();

  console.log('Auth state:', { 
    hasToken: !!token, 
    isPublicPath 
  });

  if (!token && !isPublicPath) {
    console.log('Redirecting to login - no token');
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (token && isPublicPath) {
    console.log('Redirecting to home - has token');
    url.pathname = '/';
    return NextResponse.redirect(url);
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
    '/chat',
     '/dashboard/:path*',
    '/profile/:path*'
  ]
}; 