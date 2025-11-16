import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAccessTokenPayloadEdge } from '@/lib/security/jwt-edge';

// Routes that require authentication
const protectedRoutes = ['/family', '/dashboard'];

// Routes that are completely public (no auth needed)
const publicRoutes = ['/', '/personal', '/login', '/register', '/contact'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected (starts with /family or /dashboard)
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if the route is explicitly public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  // Allow public routes
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Get JWT secret from environment
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return NextResponse.redirect(new URL('/login?error=server_error', request.url));
    }

    // Verify the token
    const payload = await getAccessTokenPayloadEdge(accessToken, jwtSecret);

    if (!payload) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      
      // Clear invalid cookies
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      
      return response;
    }

    // For family routes, check for superuser or admin role
    if (pathname.startsWith('/family')) {
      const userRole = payload.role as string | undefined;
      
      if (userRole !== 'superuser' && userRole !== 'admin') {
        // User doesn't have required role
        return NextResponse.redirect(new URL('/login?error=insufficient_permissions', request.url));
      }
    }

    // User is authenticated and authorized
    return NextResponse.next();
  }

  // Default: allow the request
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)' 
  ],
};
