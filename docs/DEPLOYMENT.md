# Deployment Guide

Complete guide for deploying the Portfolio Generation Platform to production.

## Pre-Deployment Checklist

### 1. Environment Setup

- [ ] Node.js 18+ installed
- [ ] Database (PostgreSQL/MongoDB) provisioned
- [ ] Storage bucket (S3/GCS) created and configured
- [ ] Domain registered and DNS configured
- [ ] Vercel account created
- [ ] OAuth apps registered (GitHub/Google)

### 2. Configuration

- [ ] All environment variables configured
- [ ] Secrets generated and stored securely
- [ ] Database schema deployed
- [ ] Storage bucket permissions configured
- [ ] Email service configured (SMTP)

### 3. Security

- [ ] Security review completed
- [ ] Secrets rotated from defaults
- [ ] Rate limiting configured
- [ ] HTTPS certificates ready
- [ ] Backup strategy implemented

## Step-by-Step Deployment

### Step 1: Prepare the Database

#### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE portfolio_platform;

-- Create user
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE portfolio_platform TO portfolio_user;

-- Connect to database
\c portfolio_platform

-- Create tables (example schema)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  format VARCHAR(10) NOT NULL,
  stored_location TEXT NOT NULL,
  encryption_iv VARCHAR(64) NOT NULL,
  auth_tag VARCHAR(64) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed_at TIMESTAMP,
  retention_until TIMESTAMP NOT NULL,
  parsed_data JSONB
);

CREATE TABLE profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  stored_location TEXT NOT NULL,
  encryption_iv VARCHAR(64) NOT NULL,
  auth_tag VARCHAR(64) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retention_until TIMESTAMP NOT NULL
);

CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id),
  photo_id UUID REFERENCES profile_photos(id),
  username VARCHAR(50) UNIQUE NOT NULL,
  theme VARCHAR(50) DEFAULT 'modern',
  layout VARCHAR(50) DEFAULT 'single-page',
  custom_domain VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft',
  published_url TEXT,
  staging_url TEXT,
  vercel_deployment_id VARCHAR(255),
  user_consent BOOLEAN DEFAULT FALSE,
  user_consent_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  last_deployed_at TIMESTAMP
);

CREATE TABLE deployment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  deployment_url TEXT,
  vercel_deployment_id VARCHAR(255),
  requested_by UUID REFERENCES users(id),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,
  metadata JSONB
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_portfolios_username ON portfolios(username);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_deployment_logs_portfolio_id ON deployment_logs(portfolio_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

### Step 2: Configure Storage (AWS S3)

```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-portfolio-bucket --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket your-portfolio-bucket \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket your-portfolio-bucket \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket your-portfolio-bucket \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Set CORS policy
aws s3api put-bucket-cors \
  --bucket your-portfolio-bucket \
  --cors-configuration file://cors-config.json
```

**cors-config.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

### Step 3: Generate Secrets

```bash
# Generate encryption key
echo "ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

# Generate JWT secret
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

# Generate session secret
echo "SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
```

Save these securely in your password manager or secret management system.

### Step 4: Configure OAuth Providers

#### GitHub OAuth App

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Click "New OAuth App"
3. Configure:
   - **Application name**: Portfolio Platform
   - **Homepage URL**: https://yourdomain.com
   - **Authorization callback URL**: https://yourdomain.com/api/auth/callback/github
4. Save Client ID and Client Secret

#### Google OAuth App

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure:
   - **Application type**: Web application
   - **Authorized redirect URIs**: https://yourdomain.com/api/auth/callback/google
4. Save Client ID and Client Secret

### Step 5: Configure Environment Variables

Create `.env.production`:

```bash
# Database
DB_URL=postgresql://portfolio_user:password@your-db-host:5432/portfolio_platform

# Storage
STORAGE_PROVIDER=s3
S3_BUCKET=your-portfolio-bucket
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Security (use generated secrets from Step 3)
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
SESSION_SECRET=your_session_secret_here
BCRYPT_SALT_ROUNDS=12

# OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id
VERCEL_PROJECT_ID=your_project_id

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Features
REQUIRE_EMAIL_VERIFICATION=true
REQUIRE_HUMAN_APPROVAL=true
ENABLE_STAGING_PREVIEW=true
RETENTION_DAYS=30

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com
```

### Step 6: Deploy to Vercel

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables
vercel env add ENCRYPTION_KEY production < encryption_key.txt
vercel env add JWT_SECRET production < jwt_secret.txt
# ... (repeat for all environment variables)

# Deploy
vercel --prod
```

#### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: ./
   - **Build Command**: npm run build
   - **Output Directory**: .next
5. Add all environment variables from Step 5
6. Click "Deploy"

### Step 7: Configure Custom Domain

1. In Vercel Dashboard, go to Project Settings → Domains
2. Add your domain: `yourdomain.com`
3. Add wildcard subdomain: `*.yourdomain.com`
4. Configure DNS records as instructed:

```
Type  Name  Value
A     @     76.76.21.21
CNAME *     cname.vercel-dns.com
```

5. Wait for DNS propagation (up to 48 hours)
6. Verify HTTPS certificate is issued

### Step 8: Post-Deployment Verification

#### Test Checklist

```bash
# 1. Health check
curl https://yourdomain.com/api/health

# 2. Test authentication
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# 3. Test rate limiting
for i in {1..10}; do
  curl https://yourdomain.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong","password":"wrong"}'
done

# 4. Check database connection
psql $DB_URL -c "SELECT COUNT(*) FROM users;"

# 5. Verify storage access
aws s3 ls s3://your-portfolio-bucket/
```

#### Browser Testing

- [ ] Visit homepage: https://yourdomain.com
- [ ] Register new account
- [ ] Verify email
- [ ] Login with credentials
- [ ] Upload test resume
- [ ] Generate portfolio preview
- [ ] Publish portfolio
- [ ] Visit published portfolio
- [ ] Test responsive design (mobile/tablet)
- [ ] Test OAuth login (GitHub/Google)

### Step 9: Enable Monitoring

#### Vercel Analytics

1. In Vercel Dashboard → Project Settings → Analytics
2. Enable "Web Analytics"
3. Enable "Speed Insights"

#### Database Monitoring

For PostgreSQL:
```sql
-- Enable pg_stat_statements for query monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View top queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

#### Error Tracking (Optional)

Integrate Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Step 10: Set Up Backups

#### Database Backups

```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
pg_dump $DB_URL | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
EOF

chmod +x backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /path/to/backup-db.sh
```

#### Storage Backups

Enable S3 bucket versioning and lifecycle policies:

```bash
# Lifecycle policy to move old versions to Glacier
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-portfolio-bucket \
  --lifecycle-configuration file://lifecycle-policy.json
```

**lifecycle-policy.json:**
```json
{
  "Rules": [
    {
      "Id": "Move old versions to Glacier",
      "Status": "Enabled",
      "NoncurrentVersionTransitions": [
        {
          "NoncurrentDays": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 365
      }
    }
  ]
}
```

## Deployment Automation

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ secrets.APP_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Procedure

### Quick Rollback (Vercel)

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

### Database Rollback

```bash
# Restore from backup
gunzip < /backups/backup_YYYYMMDD_HHMMSS.sql.gz | psql $DB_URL

# Verify restoration
psql $DB_URL -c "SELECT MAX(created_at) FROM users;"
```

### Emergency Procedure

1. **Identify Issue**: Check error logs and monitoring
2. **Assess Impact**: Determine affected users/features
3. **Decision**: Rollback vs. hotfix
4. **Execute**: Use quick rollback commands above
5. **Verify**: Test critical paths
6. **Notify**: Update users if needed
7. **Post-mortem**: Document incident and prevention

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check build logs
vercel logs <deployment-url>

# Test build locally
npm run build

# Clear cache
rm -rf .next
npm ci
npm run build
```

#### Database Connection Issues

```bash
# Test connection
psql $DB_URL -c "SELECT 1;"

# Check SSL requirements
psql "$DB_URL?sslmode=require" -c "SELECT 1;"

# Verify firewall rules
telnet your-db-host 5432
```

#### Storage Access Issues

```bash
# Test S3 access
aws s3 ls s3://your-portfolio-bucket/ --profile production

# Check bucket policy
aws s3api get-bucket-policy --bucket your-portfolio-bucket

# Verify IAM permissions
aws iam get-user
```

## Maintenance

### Regular Tasks

**Daily:**
- [ ] Monitor error logs
- [ ] Check rate limit violations
- [ ] Review authentication failures

**Weekly:**
- [ ] Review audit logs
- [ ] Check storage usage
- [ ] Verify backups

**Monthly:**
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Rotate secrets (if due)
- [ ] Review performance metrics

## Support

For deployment issues:
- Email: devops@yourdomain.com
- Slack: #platform-support
- On-call: +1-XXX-XXX-XXXX
