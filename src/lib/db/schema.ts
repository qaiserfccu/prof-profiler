// Users table (already exists in the system)
export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name?: string;
  profilePhotoUrl?: string;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

// User Portfolio Photos (max 3 per user)
export interface UserPortfolioPhoto {
  id: string;
  userId: string;
  photoUrl: string;
  uploadedAt: Date;
}

// Resumes
export interface Resume {
  id: string;
  userId: string;
  resumeUrl: string;
  originalFilename: string;
  uploadedAt: Date;
  aiNotes?: string; // rich text box content
  portfolioGenerated: boolean;
  // Legacy fields for backward compatibility
  fileName?: string;
  format?: string;
  storedLocation?: string;
  encryptionIv?: string;
  authTag?: string;
  retentionUntil?: Date;
  parsed?: any;
}

// Generated Portfolio (one per resume)
export interface GeneratedPortfolio {
  id: string;
  resumeId: string;
  userId: string;
  themeId?: string;
  generatedAt: Date;
}

// Portfolio Theme (random gradient per generation)
export interface PortfolioTheme {
  id: string;
  portfolioId: string;
  gradientCss: string;
  createdAt: Date;
}

// Portfolio Pages (4 pages per portfolio)
export type PageType = 'home' | 'about' | 'portfolio' | 'contact';

export interface PortfolioPage {
  id: string;
  portfolioId: string;
  pageType: PageType;
  title: string;
  content: string; // AI generated detailed content (JSON or HTML)
  publicUrl: string;
  createdAt: Date;
}