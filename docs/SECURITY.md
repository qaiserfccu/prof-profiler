# Security Best Practices & Compliance

## Overview

This document outlines the security measures, best practices, and compliance requirements for the Portfolio Generation Platform.

## Authentication & Authorization

### Password Security

**DO:**
- ✅ Use OAuth2 (GitHub/Google) as primary authentication method
- ✅ Hash passwords with scrypt or argon2 (minimum 12 rounds for bcrypt)
- ✅ Store only hashed passwords, never plaintext
- ✅ Use secure session management with HTTP-only cookies
- ✅ Implement rate limiting on authentication endpoints (5 attempts per 15 min)
- ✅ Require strong passwords (min 12 characters, mixed case, numbers, symbols)
- ✅ Implement email verification before account activation

**DON'T:**
- ❌ Store plaintext passwords
- ❌ Use weak hashing algorithms (MD5, SHA1)
- ❌ Expose user credentials in logs or error messages
- ❌ Allow unlimited login attempts
- ❌ Use predictable session tokens

### JWT Token Management

```typescript
// Secure JWT configuration
const tokenConfig = {
  accessToken: {
    expiresIn: 3600, // 1 hour
    type: 'access',
  },
  refreshToken: {
    expiresIn: 604800, // 7 days
    type: 'refresh',
  },
};
```

**Security Requirements:**
- JWT_SECRET must be at least 32 characters
- Use HS256 algorithm for signing
- Set appropriate expiration times
- Store tokens in HTTP-only cookies with Secure and SameSite flags
- Implement token rotation on refresh

### Session Configuration

```typescript
// Secure cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 3600000, // 1 hour
  path: '/',
};
```

## Data Protection

### PII Encryption

All Personally Identifiable Information (PII) must be encrypted at rest:

**Covered Data:**
- Resume files (PDF, DOCX, MD)
- Profile photos
- Parsed resume data (name, email, phone, address)
- User contact information

**Encryption Standard:**
- Algorithm: AES-256-GCM
- Key size: 256 bits (32 bytes)
- Initialization Vector: 16 bytes (random per encryption)
- Authentication Tag: 16 bytes (for integrity verification)

**Implementation:**
```typescript
import { encryptFile, decryptFile } from '@/lib/security/encryption';

// Encrypt before storage
const { encryptedData, iv, authTag } = encryptFile(fileBuffer);

// Store encrypted data, IV, and auth tag separately
await storage.upload(encryptedData);
await db.saveMetadata({ iv, authTag, location });

// Decrypt on retrieval
const encrypted = await storage.download(location);
const decrypted = decryptFile(encrypted, iv, authTag);
```

### Encryption Key Management

**Key Generation:**
```bash
# Generate 256-bit encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Storage:**
- Store ENCRYPTION_KEY in environment variables or secret manager
- Never commit keys to version control
- Rotate keys periodically (every 90 days recommended)
- Maintain key versioning for decrypting old data

**Key Rotation Procedure:**
1. Generate new encryption key
2. Re-encrypt all existing data with new key
3. Update ENCRYPTION_KEY in all environments
4. Archive old key for emergency recovery (30-day retention)

### Data Retention & Purging

**Default Policy:**
- Resume files: 30 days from upload
- Profile photos: 30 days from upload
- Session data: 7 days from creation
- Audit logs: 365 days

**Automatic Purging:**
```typescript
// Run daily cron job
async function purgeExpiredData() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
  
  // Delete expired files
  await db.deleteExpiredResumes(cutoffDate);
  await db.deleteExpiredPhotos(cutoffDate);
  
  // Delete from storage
  await storage.purgeExpiredFiles(cutoffDate);
}
```

**Manual Purge (User Request):**
- User can request immediate data deletion
- Process within 48 hours
- Send confirmation email
- Log deletion in audit trail

## Rate Limiting & Abuse Prevention

### Rate Limit Configuration

| Endpoint Type | Window | Max Requests | Action on Exceed |
|--------------|--------|--------------|------------------|
| Authentication | 15 min | 5 | Block 1 hour |
| File Upload | 1 hour | 10 | Block 24 hours |
| Deployment | 24 hours | 5 | Require approval |
| API (General) | 15 min | 100 | Temporary block |
| Admin Operations | 1 hour | 50 | Alert & audit |

### Implementation

```typescript
import { createRateLimiter, RateLimitPresets } from '@/lib/middleware/rateLimit';

// Apply to API routes
export const POST = createRateLimiter('auth')(async (request) => {
  // Handler code
});
```

### Monitoring & Alerts

- Log all rate limit violations
- Alert admins on repeated violations (3+ in 24 hours)
- Implement IP-based and user-based limits
- Consider CAPTCHA after multiple failed attempts

## File Upload Security

### Validation

**File Type Restrictions:**
- Resumes: PDF, DOCX, MD, TXT only
- Photos: JPEG, PNG, WebP only
- Maximum file size: 10MB per file

**Validation Steps:**
1. Check file extension
2. Verify MIME type
3. Scan for malware (optional: ClamAV integration)
4. Check file size
5. Validate file structure (magic bytes)

```typescript
const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File, type: 'resume' | 'photo') {
  const allowedTypes = type === 'resume' ? ALLOWED_RESUME_TYPES : ALLOWED_IMAGE_TYPES;
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
}
```

### Storage Security

**S3/GCS Configuration:**
```json
{
  "bucket": {
    "versioning": true,
    "encryption": "AES256",
    "publicAccess": false,
    "cors": {
      "allowedOrigins": ["https://yourdomain.com"],
      "allowedMethods": ["GET", "PUT"],
      "maxAge": 3600
    }
  }
}
```

**Access Control:**
- Use presigned URLs for uploads/downloads (1-hour expiration)
- Implement bucket policies restricting access
- Enable server-side encryption
- Use IAM roles with least-privilege principle

## Deployment Security

### Approval Workflow

**Required Steps:**
1. User uploads resume and photo
2. User consents to publishing (checkbox)
3. System generates staging preview
4. User reviews staging site
5. User confirms publication
6. Admin approval (optional, for first deployment)
7. System deploys to production
8. Log deployment action

**Logging:**
```typescript
interface DeploymentLog {
  userId: string;
  portfolioId: string;
  action: 'publish' | 'unpublish' | 'update';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  errorMessage?: string;
}
```

### Rollback Procedure

**Immediate Rollback:**
```bash
# Via Vercel CLI
vercel rollback [previous-deployment-url]

# Via Vercel Dashboard
1. Go to Deployments
2. Select last working deployment
3. Click "Promote to Production"
```

**Database Rollback:**
1. Identify affected records from audit logs
2. Restore from backup (maintain daily backups)
3. Verify data integrity
4. Notify affected users

## Secrets Management

### Environment Variables

**Critical Secrets:**
- `JWT_SECRET` - JWT signing key
- `ENCRYPTION_KEY` - AES encryption key
- `SESSION_SECRET` - Session signing key
- `OAUTH_CLIENT_SECRET` - OAuth client secrets
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `DB_URL` - Database connection string with password

**Storage Options:**
1. **Vercel**: Project Settings → Environment Variables
2. **GitHub**: Repository Secrets (for CI/CD)
3. **Vault/AWS Secrets Manager**: For production (recommended)

**Best Practices:**
- Never commit secrets to git
- Use different secrets for dev/staging/prod
- Rotate secrets every 90 days
- Limit secret access to required personnel only
- Audit secret usage regularly

### Secret Rotation Schedule

| Secret | Rotation Frequency | Process |
|--------|-------------------|---------|
| JWT_SECRET | 90 days | Generate new, update env, restart app |
| ENCRYPTION_KEY | 90 days | Generate new, re-encrypt data, update |
| OAuth Secrets | When compromised | Regenerate in OAuth provider dashboard |
| Database Password | 90 days | Update in DB and env simultaneously |
| API Tokens | 30 days | Regenerate in service dashboard |

## Audit Logging

### Required Events

Log the following events:
- User registration/login/logout
- Password changes
- File uploads/downloads
- Portfolio creation/updates/deletion
- Deployment actions
- Data purge requests
- Admin actions
- Rate limit violations
- Authentication failures

### Log Format

```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed';
  metadata?: Record<string, unknown>;
}
```

### Log Retention

- Store audit logs for minimum 365 days
- Archive older logs to cold storage
- Enable log analysis and alerting
- Implement log rotation to prevent disk space issues

## Compliance Requirements

### GDPR Compliance

- ✅ Obtain explicit consent before processing PII
- ✅ Provide data export functionality
- ✅ Implement right to be forgotten (delete all user data)
- ✅ Maintain data processing records
- ✅ Implement privacy policy
- ✅ Enable cookie consent banner
- ✅ Appoint data protection officer (if required)

### Security Monitoring

**Daily:**
- Review rate limit violations
- Check authentication failure patterns
- Monitor storage usage

**Weekly:**
- Review audit logs for anomalies
- Check for outdated dependencies
- Verify backup integrity

**Monthly:**
- Security vulnerability scanning
- Penetration testing (if budget allows)
- Review access permissions
- Update security documentation

## Incident Response

### Security Incident Procedure

1. **Detection**: Identify security incident
2. **Containment**: Isolate affected systems
3. **Investigation**: Determine scope and impact
4. **Remediation**: Fix vulnerability
5. **Recovery**: Restore normal operations
6. **Post-mortem**: Document lessons learned

### Contact Information

**Security Team:**
- Primary: security@yourdomain.com
- Emergency: +1-XXX-XXX-XXXX

**Escalation Path:**
1. On-call engineer
2. Technical lead
3. CTO/Security officer

## Security Checklist

Before production deployment:

- [ ] All secrets stored in secure secret manager
- [ ] Encryption keys generated and configured
- [ ] OAuth providers configured with correct callback URLs
- [ ] Rate limiting enabled on all endpoints
- [ ] File upload validation implemented
- [ ] Storage bucket properly configured with encryption
- [ ] Database connections use SSL
- [ ] Audit logging enabled
- [ ] Data retention policy configured
- [ ] Backup strategy in place and tested
- [ ] Monitoring and alerting configured
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] HTTPS enforced
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies updated and vulnerability-free
- [ ] Security testing completed

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
