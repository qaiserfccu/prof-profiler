/**
 * Local File Storage Utility
 * Handles file uploads to local filesystem instead of AWS S3
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Base directory for uploads (relative to project root)
const UPLOAD_BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Ensure upload directories exist
 */
async function ensureUploadDirs(): Promise<void> {
  const dirs = [
    UPLOAD_BASE_DIR,
    path.join(UPLOAD_BASE_DIR, 'resumes'),
    path.join(UPLOAD_BASE_DIR, 'photos'),
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore
    }
  }
}

/**
 * Upload file to local storage
 * @param fileBuffer - File buffer
 * @param fileName - Original filename
 * @param userId - User ID for organizing files
 * @param type - File type (resume or photo)
 * @returns Public URL path
 */
export async function uploadFileLocally(
  fileBuffer: Buffer,
  fileName: string,
  userId: string,
  type: 'resume' | 'photo'
): Promise<string> {
  await ensureUploadDirs();

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);
  const uniqueFileName = `${userId}_${timestamp}_${randomId}${extension}`;

  // Determine storage path
  const typeDir = type === 'resume' ? 'resumes' : 'photos';
  const filePath = path.join(UPLOAD_BASE_DIR, typeDir, uniqueFileName);

  // Write file to disk
  await fs.writeFile(filePath, fileBuffer);

  // Return public URL path
  return `/uploads/${typeDir}/${uniqueFileName}`;
}

/**
 * Delete file from local storage
 * @param publicUrl - Public URL path of the file
 */
export async function deleteFileLocally(publicUrl: string): Promise<void> {
  try {
    // Convert public URL to filesystem path
    const relativePath = publicUrl.replace(/^\/uploads\//, '');
    const filePath = path.join(UPLOAD_BASE_DIR, relativePath);

    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error if file doesn't exist
  }
}

/**
 * Read file from local storage
 * @param publicUrl - Public URL path of the file
 * @returns File buffer
 */
export async function readFileLocally(publicUrl: string): Promise<Buffer> {
  const relativePath = publicUrl.replace(/^\/uploads\//, '');
  const filePath = path.join(UPLOAD_BASE_DIR, relativePath);

  return await fs.readFile(filePath);
}

/**
 * Check if file exists in local storage
 * @param publicUrl - Public URL path of the file
 * @returns True if file exists
 */
export async function fileExistsLocally(publicUrl: string): Promise<boolean> {
  try {
    const relativePath = publicUrl.replace(/^\/uploads\//, '');
    const filePath = path.join(UPLOAD_BASE_DIR, relativePath);
    
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file size
 * @param publicUrl - Public URL path of the file
 * @returns File size in bytes
 */
export async function getFileSize(publicUrl: string): Promise<number> {
  const relativePath = publicUrl.replace(/^\/uploads\//, '');
  const filePath = path.join(UPLOAD_BASE_DIR, relativePath);
  
  const stats = await fs.stat(filePath);
  return stats.size;
}

/**
 * List all files for a user
 * @param userId - User ID
 * @param type - File type (resume or photo)
 * @returns Array of public URL paths
 */
export async function listUserFiles(
  userId: string,
  type: 'resume' | 'photo'
): Promise<string[]> {
  await ensureUploadDirs();
  
  const typeDir = type === 'resume' ? 'resumes' : 'photos';
  const dirPath = path.join(UPLOAD_BASE_DIR, typeDir);

  try {
    const files = await fs.readdir(dirPath);
    
    // Filter files by userId prefix
    const userFiles = files.filter(file => file.startsWith(`${userId}_`));
    
    return userFiles.map(file => `/uploads/${typeDir}/${file}`);
  } catch (error) {
    return [];
  }
}
