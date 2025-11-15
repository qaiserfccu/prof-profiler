/**
 * Encryption utilities for PII data (resumes, photos)
 * Uses AES-256-GCM encryption for secure file encryption at rest
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES-256-GCM, 12 bytes (96 bits) is recommended per NIST SP 800-38D, but 16 bytes also works
const KEY_LENGTH = 32; // 256 bits

/**
 * Get encryption key from environment
 * Must be 32 bytes (64 hex characters) for AES-256
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes for AES-256)');
  }
  
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt (Buffer or string)
 * @returns Object containing encrypted data, IV, and auth tag
 */
export function encrypt(data: Buffer | string): {
  encrypted: Buffer;
  iv: string;
  authTag: string;
} {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypt data using AES-256-GCM
 * @param encrypted - Encrypted data buffer
 * @param iv - Initialization vector (hex string)
 * @param authTag - Authentication tag (hex string)
 * @returns Decrypted data buffer
 */
export function decrypt(
  encrypted: Buffer,
  iv: string,
  authTag: string
): Buffer {
  const key = getEncryptionKey();
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);
  
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  
  return decrypted;
}

/**
 * Encrypt a file (for resume/photo uploads)
 * @param fileBuffer - File contents as buffer
 * @returns Encrypted file data with metadata
 */
export function encryptFile(fileBuffer: Buffer): {
  encryptedData: Buffer;
  iv: string;
  authTag: string;
} {
  const result = encrypt(fileBuffer);
  return {
    encryptedData: result.encrypted,
    iv: result.iv,
    authTag: result.authTag,
  };
}

/**
 * Decrypt a file
 * @param encryptedData - Encrypted file buffer
 * @param iv - Initialization vector
 * @param authTag - Authentication tag
 * @returns Decrypted file buffer
 */
export function decryptFile(
  encryptedData: Buffer,
  iv: string,
  authTag: string
): Buffer {
  return decrypt(encryptedData, iv, authTag);
}

/**
 * Generate a secure random encryption key
 * Use this to generate ENCRYPTION_KEY for .env
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Encrypt sensitive text data (like parsed resume data)
 * @param text - Text to encrypt
 * @returns Encrypted text with IV and auth tag
 */
export function encryptText(text: string): string {
  const result = encrypt(text);
  // Combine encrypted data, IV, and auth tag into a single string
  return JSON.stringify({
    data: result.encrypted.toString('base64'),
    iv: result.iv,
    authTag: result.authTag,
  });
}

/**
 * Decrypt sensitive text data
 * @param encryptedText - Encrypted text string
 * @returns Decrypted text
 */
export function decryptText(encryptedText: string): string {
  const parsed = JSON.parse(encryptedText);
  const encrypted = Buffer.from(parsed.data, 'base64');
  const decrypted = decrypt(encrypted, parsed.iv, parsed.authTag);
  return decrypted.toString('utf8');
}
