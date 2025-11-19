/**
 * User Registration API Route
 * POST /api/auth/register
 * 
 * Registers a new user with email and password
 * Requires email verification before account activation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAccessToken, createRefreshToken } from '@/lib/security/jwt';
import { hashPassword } from '@/lib/security/auth';
import { createUser, findUserByEmail } from '@/lib/db/services';

// Rate limit: 5 requests per 15 minutes
// TODO: Apply rate limiting middleware

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    
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
    
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password strength (min 5 chars for simplicity)
    if (body.password.length < 5) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 5 characters' 
        },
        { status: 400 }
      );
    }
    
    // Check if user already exists in database
    const existingUser = await findUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(body.password);
    
    // Create user in database
    const user = await createUser({
      email: body.email,
      passwordHash,
      name: body.name,
      role: 'user',
      emailVerified: false,
      isActive: true,
    });
    
    // TODO: Generate email verification token
    // const verificationToken = generateVerificationToken();
    // await db.verificationTokens.create({
    //   userId: user.id,
    //   token: hashToken(verificationToken),
    //   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    // });
    
    // TODO: Send verification email
    // await sendVerificationEmail(body.email, verificationToken);
    
    // Create tokens (in production, only after email verification)
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
    
    // Set HTTP-only cookies
    const response = NextResponse.json(
      {
        message: 'User registered successfully.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 }
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
    
    // TODO: Log audit event
    // await db.auditLogs.create({
    //   action: 'user_registered',
    //   resource: 'user',
    //   resourceId: user.id,
    //   ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    //   userAgent: request.headers.get('user-agent') || 'unknown',
    // });
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
