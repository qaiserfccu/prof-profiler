/**
 * User Logout API Route
 * POST /api/auth/logout
 * 
 * Logs out the current user by invalidating tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/security/jwt';

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (accessToken) {
      // Verify token and get user ID
      const userId = verifyAccessToken(accessToken);
      
      if (userId) {
        // TODO: Invalidate refresh token in database
        // await db.sessions.deleteByUserId(userId);
        
        // TODO: Log logout event
        // await db.auditLogs.create({
        //   userId,
        //   action: 'logout',
        //   resource: 'user',
        //   resourceId: userId,
        //   ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        //   userAgent: request.headers.get('user-agent') || 'unknown',
        // });
      }
    }
    
    // Clear cookies
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
    
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cookies even if there's an error
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
    
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    return response;
  }
}
