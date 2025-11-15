/**
 * Database Schema Definitions
 * 
 * This file contains TypeScript interfaces for the database models.
 * Implement these with your chosen ORM (Prisma, Drizzle, Mongoose, etc.)
 */

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  passwordHash?: string; // Only for self-hosted auth, otherwise use OAuth
  name?: string;
  avatarUrl?: string;
  provider: 'email' | 'github' | 'google'; // OAuth provider
  providerId?: string; // OAuth provider user ID
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  format: 'pdf' | 'docx' | 'md' | 'txt';
  storedLocation: string; // Encrypted file path in S3/GCS
  encryptionIv: string; // Initialization vector for AES encryption
  uploadedAt: Date;
  lastAccessedAt?: Date;
  retentionUntil: Date; // Auto-calculated: uploadedAt + RETENTION_DAYS
  
  // Parsed data from resume (AI-extracted)
  parsed?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    workExperience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      description: string;
      highlights: string[];
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      gpa?: string;
    }>;
    skills: string[];
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
      repository?: string;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
      url?: string;
    }>;
  };
}

export interface ProfilePhoto {
  id: string;
  userId: string;
  fileName: string;
  storedLocation: string; // Encrypted file path in S3/GCS
  encryptionIv: string;
  uploadedAt: Date;
  retentionUntil: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  resumeId: string;
  photoId?: string;
  username: string; // Unique username for portfolio URL
  
  // Portfolio configuration
  theme: 'modern' | 'minimal' | 'creative' | 'professional';
  layout: 'single-page' | 'multi-page';
  customDomain?: string;
  
  // Deployment status
  status: 'draft' | 'staging' | 'published' | 'archived';
  publishedUrl?: string;
  stagingUrl?: string;
  vercelDeploymentId?: string;
  
  // Consent & approval
  userConsent: boolean;
  userConsentAt?: Date;
  approvedBy?: string; // Admin user ID who approved
  approvedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  lastDeployedAt?: Date;
}

export interface DeploymentLog {
  id: string;
  portfolioId: string;
  userId: string;
  action: 'create' | 'update' | 'publish' | 'unpublish' | 'delete';
  status: 'pending' | 'success' | 'failed';
  deploymentUrl?: string;
  vercelDeploymentId?: string;
  
  // Audit trail
  requestedBy: string; // User ID
  requestedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  
  // Metadata
  metadata?: {
    commitSha?: string;
    buildTime?: number;
    deployTime?: number;
  };
}

export interface Session {
  id: string;
  userId: string;
  token: string; // JWT token or session token hash
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// Rate limiting tracking
export interface RateLimit {
  id: string;
  userId?: string;
  ipAddress?: string;
  endpoint: string;
  requestCount: number;
  windowStart: Date;
  windowEnd: Date;
}
