/**
 * User Login API Route
 * POST /api/auth/login
 * 
 * Authenticates user with email and password
 * Returns access and refresh tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAccessToken, createRefreshToken } from '@/lib/security/jwt';
import { verifyPassword } from '@/lib/security/auth';
import { findUserByEmail, updateUserLastLogin } from '@/lib/db/services';

// Rate limit: 5 requests per 15 minutes
// TODO: Apply rate limiting middleware

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    // Fetch user from database
    const user = await findUserByEmail(body.email);
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(body.password, user.passwordHash);
    if (!isValidPassword) {
      // Log failed login attempt
      // await db.auditLogs.create({
      //   action: 'login_failed',
      //   resource: 'user',
      //   resourceId: user.id,
      //   ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      //   userAgent: request.headers.get('user-agent') || 'unknown',
      // });
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }
    
    // Check if email is verified (if required)
    // if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.emailVerified) {
    //   return NextResponse.json(
    //     { error: 'Email not verified. Please check your email.' },
    //     { status: 403 }
    //   );
    // }
    
    // Generate tokens
    const accessToken = createAccessToken(user.id, user.email, user.role);
    const refreshToken = createRefreshToken(user.id);
    
    // TODO: Store refresh token in database
    // await db.sessions.create({
    //   userId: user.id,
    //   token: hashToken(refreshToken),
    //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //   ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    //   userAgent: request.headers.get('user-agent') || 'unknown',
    // });
    
    // Update last login timestamp
    await updateUserLastLogin(user.id);
    
    // Set HTTP-only cookies
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 }
    );
    
    // Set secure cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800, // 7 days
      path: '/',
    });
    
    // TODO: Log successful login
    // await db.auditLogs.create({
    //   userId: user.id,
    //   action: 'login_success',
    //   resource: 'user',
    //   resourceId: user.id,
    //   ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    //   userAgent: request.headers.get('user-agent') || 'unknown',
    // });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
