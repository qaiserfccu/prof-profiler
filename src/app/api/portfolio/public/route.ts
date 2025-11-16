import { NextRequest, NextResponse } from 'next/server';
import {
  findGeneratedPortfolioByResumeId,
  findPortfolioPageByType,
  listUserPortfolioPhotos,
  isValidPageType,
} from '@/lib/db/services';
import type { PageType } from '@/lib/db/schema';

/**
 * GET /api/portfolio/public
 * Fetch public portfolio page content
 * Query params: userId, resumeId, pageType
 * 
 * This endpoint is public (no auth required) to allow viewing of generated portfolios
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const resumeId = searchParams.get('resumeId');
    const pageType = searchParams.get('pageType');

    // Validate required parameters
    if (!userId || !resumeId || !pageType) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, resumeId, pageType' },
        { status: 400 }
      );
    }

    // Validate page type
    if (!isValidPageType(pageType)) {
      return NextResponse.json(
        { error: 'Invalid page type. Must be: home, about, portfolio, or contact' },
        { status: 400 }
      );
    }

    // Find the portfolio
    const portfolio = await findGeneratedPortfolioByResumeId(resumeId);

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Verify the portfolio belongs to the specified user
    if (portfolio.userId !== userId) {
      return NextResponse.json(
        { error: 'Portfolio does not belong to the specified user' },
        { status: 403 }
      );
    }

    // Fetch the specific page content
    const page = await findPortfolioPageByType(portfolio.id, pageType as PageType);

    if (!page) {
      return NextResponse.json(
        { error: `Page type '${pageType}' not found for this portfolio` },
        { status: 404 }
      );
    }

    // Fetch user's portfolio photos
    const photos = await listUserPortfolioPhotos(userId);
    const photoUrls = photos.map(photo => photo.photoUrl);

    // Return the page content with photos
    return NextResponse.json({
      pageType: page.pageType,
      title: page.title,
      content: page.content,
      photos: photoUrls,
      publicUrl: page.publicUrl,
    });

  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
