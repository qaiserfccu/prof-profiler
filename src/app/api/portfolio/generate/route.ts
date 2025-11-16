/**
 * Portfolio Generation API Route
 * POST /api/portfolio/generate
 * 
 * Generates an AI-powered portfolio from a resume
 * Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/security/jwt';
import {
  findResumeById,
  findUserById,
  listUserPortfolioPhotos,
  findGeneratedPortfolioByResumeId,
  generateCompletePortfolio,
} from '@/lib/db/services';
import { generatePortfolioContent, generateGradientTheme } from '@/lib/ai/portfolio-generator';
import { PageType } from '@/lib/db/schema';

interface GenerateRequest {
  resumeId: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = verifyAccessToken(accessToken);
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body: GenerateRequest = await request.json();
    
    if (!body.resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }
    
    // Find resume and verify ownership
    const resume = await findResumeById(body.resumeId);
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }
    
    if (resume.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to this resume' },
        { status: 403 }
      );
    }
    
    // Check if portfolio already exists for this resume
    const existingPortfolio = await findGeneratedPortfolioByResumeId(body.resumeId);
    if (existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio already generated for this resume' },
        { status: 409 }
      );
    }
    
    // Get user information
    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user photos (profile + portfolio photos)
    const portfolioPhotos = await listUserPortfolioPhotos(userId);
    const photos = {
      profilePhoto: user.profilePhotoUrl || undefined,
      portfolioPhotos: portfolioPhotos.slice(0, 3).map((p: { photoUrl: string }) => p.photoUrl),
    };
    
    // Prepare resume data for AI generation
    const resumeData = {
      resumeUrl: resume.resumeUrl,
      aiNotes: resume.aiNotes,
    };
    
    // Generate AI content for all pages
    const aiContent = await generatePortfolioContent(resumeData, photos);
    
    // Generate random gradient theme
    const gradientCss = generateGradientTheme();
    
    // Create portfolio pages data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const portfolioSlug = `portfolio-${Date.now()}`;
    
    const pages = [
      {
        pageType: 'home' as PageType,
        title: aiContent.home.title,
        content: aiContent.home.content,
        publicUrl: `${baseUrl}/portfolio/${portfolioSlug}`,
      },
      {
        pageType: 'about' as PageType,
        title: aiContent.about.title,
        content: aiContent.about.content,
        publicUrl: `${baseUrl}/portfolio/${portfolioSlug}/about`,
      },
      {
        pageType: 'portfolio' as PageType,
        title: aiContent.portfolio.title,
        content: aiContent.portfolio.content,
        publicUrl: `${baseUrl}/portfolio/${portfolioSlug}/portfolio`,
      },
      {
        pageType: 'contact' as PageType,
        title: aiContent.contact.title,
        content: aiContent.contact.content,
        publicUrl: `${baseUrl}/portfolio/${portfolioSlug}/contact`,
      },
    ];
    
    // Create portfolio with all pages in a transaction
    const result = await generateCompletePortfolio({
      resumeId: body.resumeId,
      userId,
      gradientCss,
      pages,
    });
    
    // Return success response
    return NextResponse.json(
      {
        message: 'Portfolio generated successfully',
        portfolio: {
          id: result.portfolio.id,
          resumeId: result.portfolio.resumeId,
          theme: result.theme.gradientCss,
          generatedAt: result.portfolio.generatedAt,
          pages: result.pages.map((page: { id: string; pageType: string; title: string; publicUrl: string }) => ({
            id: page.id,
            pageType: page.pageType,
            title: page.title,
            publicUrl: page.publicUrl,
          })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Portfolio generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate portfolio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
