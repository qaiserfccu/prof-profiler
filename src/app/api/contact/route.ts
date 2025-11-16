import { NextRequest, NextResponse } from 'next/server';
import { findUserById } from '@/lib/db/services';

/**
 * POST /api/contact
 * Handle contact form submissions from public portfolio pages
 * 
 * This endpoint is public (no auth required) to allow visitors to send messages
 * In a production environment, you would:
 * - Add rate limiting
 * - Send email notifications to portfolio owner
 * - Store messages in database
 * - Add CAPTCHA verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, portfolioUserId, portfolioResumeId } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    // Find the portfolio owner (optional - for future email notifications)
    let portfolioOwner = null;
    if (portfolioUserId) {
      portfolioOwner = await findUserById(portfolioUserId);
    }

    // TODO: In production, implement:
    // 1. Send email notification to portfolio owner
    // 2. Store message in database for tracking
    // 3. Add rate limiting per IP address
    // 4. Add CAPTCHA verification
    // 5. Sanitize and validate all inputs

    // Log the contact attempt (in production, you'd send an email or store in DB)
    console.log('Contact form submission:', {
      from: { name, email },
      subject,
      messageLength: message.length,
      portfolioUserId,
      portfolioResumeId,
      timestamp: new Date().toISOString(),
    });

    // For now, just return success
    // In production, you would send an email to portfolioOwner.email
    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}
