/**
 * JWT Token utilities for session management
 * Uses HS256 algorithm for signing tokens
 */

import crypto from 'crypto';

interface JWTPayload {
  sub: string; // User ID (subject)
  email?: string;
  role?: string; // User role
  iat: number; // Issued at
  exp: number; // Expiration time
  [key: string]: unknown;
}

interface JWTPayloadInput {
  sub: string; // User ID (subject)
  email?: string;
  role?: string; // User role
  [key: string]: unknown;
}

interface JWTHeader {
  alg: string;
  typ: string;
}

/**
 * Get JWT secret from environment
 */
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  
  return secret;
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(data: string | Buffer): string {
  const base64 = Buffer.isBuffer(data) 
    ? data.toString('base64')
    : Buffer.from(data).toString('base64');
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(data: string): string {
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if necessary
  while (base64.length % 4) {
    base64 += '=';
  }
  
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Sign a JWT token
 * @param payload - Token payload
 * @param expiresIn - Expiration time in seconds (default: 24 hours)
 * @returns JWT token
 */
export function signJWT(
  payload: JWTPayloadInput,
  expiresIn: number = 86400 // 24 hours
): string {
  const secret = getJWTSecret();
  const now = Math.floor(Date.now() / 1000);
  
  const header: JWTHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };
  
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  
  const encodedSignature = base64UrlEncode(signature);
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload if valid, null otherwise
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const secret = getJWTSecret();
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      return null;
    }
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest();
    
    const actualSignature = Buffer.from(
      encodedSignature.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    );
    
    if (!crypto.timingSafeEqual(expectedSignature, actualSignature)) {
      return null;
    }
    
    // Decode payload
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Decode JWT without verification (use carefully!)
 * @param token - JWT token
 * @returns Decoded payload (unverified)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch (error) {
    return null;
  }
}

/**
 * Create a session token (short-lived access token)
 * @param userId - User ID
 * @param email - User email
 * @param role - User role (optional)
 * @returns Access token
 */
export function createAccessToken(userId: string, email: string, role?: string): string {
  return signJWT(
    { sub: userId, email, role, type: 'access' },
    3600 // 1 hour
  );
}

/**
 * Create a refresh token (long-lived)
 * @param userId - User ID
 * @returns Refresh token
 */
export function createRefreshToken(userId: string): string {
  return signJWT(
    { sub: userId, type: 'refresh' },
    604800 // 7 days
  );
}

/**
 * Verify access token
 * @param token - Access token
 * @returns User ID if valid, null otherwise
 */
export function verifyAccessToken(token: string): string | null {
  const payload = verifyJWT(token);
  
  if (!payload || payload.type !== 'access') {
    return null;
  }
  
  return payload.sub;
}

/**
 * Get full access token payload
 * @param token - Access token
 * @returns Payload if valid, null otherwise
 */
export function getAccessTokenPayload(token: string): JWTPayload | null {
  const payload = verifyJWT(token);
  
  if (!payload || payload.type !== 'access') {
    return null;
  }
  
  return payload;
}

/**
 * Verify refresh token
 * @param token - Refresh token
 * @returns User ID if valid, null otherwise
 */
export function verifyRefreshToken(token: string): string | null {
  const payload = verifyJWT(token);
  
  if (!payload || payload.type !== 'refresh') {
    return null;
  }
  
  return payload.sub;
}
