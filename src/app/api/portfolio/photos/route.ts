/**
 * Portfolio Photos API Route
 * POST/GET/DELETE /api/portfolio/photos
 * 
 * Manages user portfolio photos (max 3 per user)
 * Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/security/jwt';
import {
  canUploadMorePhotos,
  createPortfolioPhoto,
  listUserPortfolioPhotos,
  findPortfolioPhotoById,
  deletePortfolioPhoto,
  getUserPhotoCount,
} from '@/lib/db/services';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * POST - Upload a new portfolio photo
 */
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
    
    // Check upload limit
    const canUpload = await canUploadMorePhotos(userId);
    if (!canUpload) {
      const currentCount = await getUserPhotoCount(userId);
      return NextResponse.json(
        { 
          error: 'Maximum 3 portfolio photos allowed per user',
          currentCount,
          maxAllowed: 3,
        },
        { status: 403 }
      );
    }
    
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('photo') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No photo uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }
    
    // For demo purposes, create a placeholder URL
    // In production, upload to storage (S3/GCS) with encryption
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const photoUrl = `/uploads/photos/${userId}/portfolio_photo_${timestamp}.${extension}`;
    
    // Save to database
    const photo = await createPortfolioPhoto({
      userId,
      photoUrl,
    });
    
    return NextResponse.json(
      {
        message: 'Portfolio photo uploaded successfully',
        photo: {
          id: photo.id,
          photoUrl: photo.photoUrl,
          uploadedAt: photo.uploadedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Portfolio photo upload error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to upload portfolio photo',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET - List user's portfolio photos
 */
export async function GET(request: NextRequest) {
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
    
    // Get user's portfolio photos
    const photos = await listUserPortfolioPhotos(userId);
    const photoCount = await getUserPhotoCount(userId);
    
    return NextResponse.json(
      {
        photos: photos.map((photo: any) => ({
          id: photo.id,
          photoUrl: photo.photoUrl,
          uploadedAt: photo.uploadedAt,
        })),
        count: photoCount,
        maxAllowed: 3,
        canUploadMore: photoCount < 3,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Portfolio photos list error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch portfolio photos',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove a portfolio photo
 */
export async function DELETE(request: NextRequest) {
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
    
    // Get photo ID from query params
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('id');
    
    if (!photoId) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }
    
    // Find photo and verify ownership
    const photo = await findPortfolioPhotoById(photoId);
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    if (photo.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to this photo' },
        { status: 403 }
      );
    }
    
    // Delete photo from database
    const deleted = await deletePortfolioPhoto(photoId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete photo' },
        { status: 500 }
      );
    }
    
    // TODO: Delete from storage (S3/GCS)
    // await deleteFile(photo.photoUrl);
    
    return NextResponse.json(
      {
        message: 'Portfolio photo deleted successfully',
        photoId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Portfolio photo deletion error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete portfolio photo',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
