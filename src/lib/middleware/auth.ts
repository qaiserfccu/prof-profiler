/**
 * Authentication middleware helper
 * Provides utilities for protecting API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/security/jwt';

/**
 * Get authenticated user ID from request
 * @param request - Next.js request object
 * @returns User ID if authenticated, null otherwise
 */
export function getAuthenticatedUserId(request: NextRequest): string | null {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  if (!accessToken) {
    return null;
  }
  
  return verifyAccessToken(accessToken);
}

/**
 * Require authentication middleware
 * Returns 401 if user is not authenticated
 */
export function requireAuth(
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const userId = getAuthenticatedUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return handler(request, userId);
  };
}

/**
 * Check if user has required role
 * @param request - Next.js request object
 * @param requiredRole - Required role (admin, user, etc.)
 * @returns True if user has required role
 */
export async function hasRole(
  request: NextRequest,
  requiredRole: string
): Promise<boolean> {
  const userId = getAuthenticatedUserId(request);
  
  if (!userId) {
    return false;
  }
  
  // TODO: Fetch user from database and check role
  // const user = await db.users.findById(userId);
  // return user?.role === requiredRole || user?.role === 'admin';
  
  return false; // Placeholder
}

/**
 * Require specific role middleware
 */
export function requireRole(
  role: string,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const userId = getAuthenticatedUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const authorized = await hasRole(request, role);
    
    if (!authorized) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return handler(request, userId);
  };
}

/**
 * Get client IP address
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  return (
    forwarded?.split(',')[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    'unknown'
  );
}

/**
 * Get user agent
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Create audit log metadata from request
 */
export function getAuditMetadata(request: NextRequest) {
  return {
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request),
    timestamp: new Date(),
  };
}
