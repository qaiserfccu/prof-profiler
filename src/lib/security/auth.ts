/**
 * Authentication utilities
 * Provides secure password hashing and JWT token management
 */

import crypto from 'crypto';

// Constants for password hashing
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_COST = 16384; // 2^14
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

/**
 * Hash a password using scrypt (more secure than bcrypt for new implementations)
 * Format: algorithm$cost$salt$hash
 * @param password - Plain text password
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, {
      N: SCRYPT_COST,
      r: SCRYPT_BLOCK_SIZE,
      p: SCRYPT_PARALLELIZATION,
    }, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  
  // Store algorithm, cost, salt, and hash together
  return `scrypt$${SCRYPT_COST}$${salt.toString('hex')}$${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Stored password hash
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const parts = hash.split('$');
    
    if (parts.length !== 4 || parts[0] !== 'scrypt') {
      throw new Error('Invalid hash format');
    }
    
    const cost = parseInt(parts[1], 10);
    const salt = Buffer.from(parts[2], 'hex');
    const storedHash = parts[3];
    
    const derivedKey = await new Promise<Buffer>((resolve, reject) => {
      crypto.scrypt(password, salt, KEY_LENGTH, {
        N: cost,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
      }, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
    
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      derivedKey
    );
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate a secure JWT secret
 * Use this to generate JWT_SECRET for .env
 */
export function generateJWTSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a secure session token
 * @returns Random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a token for storage (e.g., session tokens)
 * @param token - Token to hash
 * @returns Hashed token
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a secure email verification token
 * @returns Verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a password reset token
 * @returns Reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Alternative: bcrypt implementation (if preferred over scrypt)
 * Note: bcrypt is widely used but scrypt is generally preferred for new implementations
 * 
 * To use bcrypt, install: npm install bcrypt @types/bcrypt
 * Then uncomment the following:
 */

/*
import bcrypt from 'bcrypt';

export async function hashPasswordBcrypt(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPasswordBcrypt(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
*/
