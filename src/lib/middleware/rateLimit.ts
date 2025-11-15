/**
 * Rate limiting middleware for API routes
 * Prevents abuse by limiting the number of requests per time window
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Get client identifier (IP address or user ID)
 */
function getClientId(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get IP from various headers
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
 * Rate limiting middleware
 * @param config - Rate limit configuration
 * @param getUserId - Optional function to extract user ID from request
 * @returns Middleware function
 */
export function rateLimit(
  config: RateLimitConfig,
  getUserId?: (request: NextRequest) => Promise<string | undefined>
) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const userId = getUserId ? await getUserId(request) : undefined;
    const clientId = getClientId(request, userId);
    const key = `${request.nextUrl.pathname}:${clientId}`;
    
    const now = Date.now();
    const record = rateLimitStore.get(key);
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to clean up on each request
      cleanupExpiredEntries();
    }
    
    if (!record || now > record.resetTime) {
      // Create new record
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      
      const response = await handler(request);
      addRateLimitHeaders(response, config.maxRequests, config.maxRequests - 1, now + config.windowMs);
      return response;
    }
    
    // Check if limit exceeded
    if (record.count >= config.maxRequests) {
      const response = NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
        { status: 429 }
      );
      
      addRateLimitHeaders(response, config.maxRequests, 0, record.resetTime);
      response.headers.set('Retry-After', String(Math.ceil((record.resetTime - now) / 1000)));
      
      return response;
    }
    
    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    
    const response = await handler(request);
    addRateLimitHeaders(
      response,
      config.maxRequests,
      config.maxRequests - record.count,
      record.resetTime
    );
    
    return response;
  };
}

/**
 * Add rate limit headers to response
 */
function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  resetTime: number
): void {
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Predefined rate limit configurations
 */
export const RateLimitPresets = {
  // Strict limits for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  
  // Standard limits for API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  
  // Limits for file uploads
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },
  
  // Strict limits for deployment endpoints
  deploy: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 5,
  },
  
  // Very strict limits for admin operations
  admin: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
  },
};

/**
 * Helper to create rate limit middleware with preset
 */
export function createRateLimiter(
  preset: keyof typeof RateLimitPresets,
  getUserId?: (request: NextRequest) => Promise<string | undefined>
) {
  return rateLimit(RateLimitPresets[preset], getUserId);
}
