# Portfolio Generation Platform

An advanced web-creation platform that generates visually polished Next.js portfolio websites from user resumes, CVs, and profile data. Built with security, privacy, and production-readiness in mind.
## Project Overview

This is a professional portfolio website built with Next.js 16, featuring:
- Modern, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Portfolio showcase with project galleries
- Contact information and social links

## Documentation

- **[DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)** - 🗄️ **START HERE** for database configuration with Neon
- **[NEON_IMPLEMENTATION.md](./docs/NEON_IMPLEMENTATION.md)** - Implementation details and summary
- **[AI_PORTFOLIO_FEATURE.md](./docs/AI_PORTFOLIO_FEATURE.md)** - AI portfolio generation guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment and environment variable setup
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow and best practices
- **[.gitignore.production](./.gitignore.production)** - Production file exclusions

## 🚀 Getting Started

**⚠️ IMPORTANT**: Before running the application, you must set up the database and environment variables. See **[DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)** for detailed instructions.

### Quick Start (Local Development)

1. **Clone the repository**:
```bash
git clone https://github.com/qaiserfccu/portfolio.ai.git
cd portfolio.ai
```

2. **Install dependencies**:
```bash
npm ci
```

3. **Set up Neon database**:
   - Sign up at https://neon.tech
   - Create a new project
   - Copy the connection string

4. **Configure environment**:
```bash
cp .env.example .env
```
Edit `.env` and add:
```env
DB_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
SESSION_SECRET=your_session_secret
```

Generate secure keys:
```bash
npm run generate-keys
```

5. **Test database connection**:
```bash
node scripts/test-db-init.mjs
```

6. **Initialize database**:
```bash
npm run db:init
```

7. **Run development server**:
```bash
npm run dev
```

8. **Open your browser** at [http://localhost:3000](http://localhost:3000)

### For Production Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete Vercel deployment instructions.

## 🔐 Authentication & Database

The application includes a complete authentication system with Neon PostgreSQL:

### Authentication Features
- **Registration**: Create account with email and password at `/register`
- **Login**: Authenticate at `/login`
- **Secure Passwords**: Scrypt hashing algorithm (more secure than bcrypt)
- **JWT Tokens**: HTTP-only cookies for secure session management
- **Protected Routes**: Dashboard and family pages require authentication
- **Public Pages**: `/`, `/personal/*`, `/contact` remain public
- **Role-based Access**: Family pages require 'superuser' or 'admin' role

### Database Features
- **Neon PostgreSQL**: Serverless database with automatic scaling
- **User Management**: Complete user profiles with authentication
- **Resume Storage**: Up to 2 resumes per free user (locally stored)
- **Photo Storage**: Up to 3 portfolio photos per user (locally stored)
- **Portfolio Generation**: Database tracks generated portfolios and pages
- **Automatic Tables**: Run `npm run db:init` to create all required tables

### File Storage
- **Local Storage**: Files stored in `public/uploads/` directory
- **No AWS Costs**: Eliminates need for S3 or cloud storage
- **Fast Access**: Direct filesystem access for uploaded files
- **Organized Structure**: 
  - Resumes: `public/uploads/resumes/`
  - Photos: `public/uploads/photos/`

📖 **[Database Setup Guide](./docs/DATABASE_SETUP.md)** - Complete configuration instructions

**Default credentials**: All registered users automatically get 'superuser' role (demo mode)

## 🌟 Features

### ✨ NEW: AI-Generated Dynamic Portfolio Pages

- **AI-Powered Content Generation**: Upload a resume and let AI generate complete portfolio websites
- **Per-Resume Portfolios**: Generate up to 2 unique portfolios (free tier) from different resumes
- **Four Dynamic Pages**: Home, About, Portfolio/Projects, and Contact pages with AI-generated content
- **Unique Themes**: Random gradient theme applied to each generated portfolio
- **Portfolio Photos**: Upload up to 3 photos that AI uses throughout your portfolio
- **Smart Content**: AI expands beyond resume text to create engaging narratives
- **Public Sharing**: Share portfolios via clean URLs like `/portfolio/{userId}/{resumeId}/home`
- **Print to PDF**: Export About page as a professional résumé-style PDF
- **Contact Forms**: Working contact forms on each portfolio

📖 **[Full Documentation](./docs/AI_PORTFOLIO_FEATURE.md)** - Detailed guide on the AI portfolio feature

### Other Features

- **Portfolio Generation**: Automatically create professional portfolio websites from uploaded resumes
- **Multi-Tenant Architecture**: Serve multiple user portfolios from a single application (username-based routing)
- **Secure Authentication**: OAuth2 (GitHub/Google) or self-hosted authentication with bcrypt/argon2
- **PII Encryption**: All resumes and photos are encrypted at rest using AES-256-GCM
- **Rate Limiting**: Built-in protection against abuse with configurable limits
- **Vercel Integration**: Seamless deployment with Vercel's platform
- **Staging & Production**: Preview changes before publishing to production
- **Data Retention**: Configurable automatic data purging (default: 30 days)
- **Audit Logging**: Complete deployment and access logs for security compliance
- **Responsive Design**: Mobile-first, accessible portfolio templates

## 🏗️ Architecture

### Deployment Strategy

This platform uses a **lightweight multi-tenant approach**:
- Single Next.js application serves all user portfolios
- Dynamic routing at `username.yourdomain.com` or `/portfolio/[username]`
- No per-user deployment overhead
- Cost-effective and scalable

### Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: JWT + Scrypt password hashing
- **Database**: Neon PostgreSQL (serverless)
- **Storage**: Local filesystem (public/uploads/)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Neon PostgreSQL database (free tier available at https://neon.tech)
- Vercel account (for deployment, optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/qaiserfccu/rao-muhammad.git
cd rao-muhammad
```

2. **Install dependencies**
```bash
npm ci
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
- Database connection (DB_URL)
- Storage credentials (AWS or GCS)
- Authentication secrets (JWT_SECRET, ENCRYPTION_KEY)
- OAuth credentials (optional but recommended)
- Vercel API token (for deployments)

4. **Generate secure secrets**
```bash
# Generate encryption key (32 bytes for AES-256)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Features

### Authentication
- **OAuth2 Support**: GitHub and Google OAuth (recommended)
- **Password Security**: Passwords hashed with scrypt (or bcrypt)
- **JWT Tokens**: Secure session management with HTTP-only cookies
- **Email Verification**: Required before portfolio deployment

### Data Protection
- **Encryption at Rest**: All PII encrypted with AES-256-GCM
- **Encryption Keys**: Stored securely in environment variables
- **Data Retention**: Automatic purging after configurable period (default: 30 days)
- **User Consent**: Explicit opt-in required before publishing portfolios

### Rate Limiting
- **Authentication**: 5 requests per 15 minutes
- **File Uploads**: 10 requests per hour
- **Deployments**: 5 per day per user
- **API Endpoints**: 100 requests per 15 minutes

### Deployment Safety
- **Staging Preview**: All changes previewed before production
- **Human Approval**: Explicit confirmation required for publishing
- **Audit Logs**: All deployments logged with timestamp and user ID
- **Rollback Support**: Instructions provided for emergency rollback

## 📁 Project Structure

```
rao-muhammad/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── portfolio/    # Portfolio management
│   │   │   └── upload/       # File upload endpoints
│   │   ├── dashboard/        # User dashboard
│   │   ├── portfolio/        # Portfolio templates
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── lib/                 # Utilities and libraries
│   │   ├── db/             # Database schemas and clients
│   │   ├── security/       # Encryption, auth, JWT
│   │   ├── storage/        # File storage (S3/GCS)
│   │   └── middleware/     # Rate limiting, auth middleware
│   └── data/               # Static data
├── public/                 # Static assets
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for a complete list of configuration options.

**Required:**
- `DB_URL`: Database connection string
- `JWT_SECRET`: Secret for JWT signing (min 32 characters)
- `ENCRYPTION_KEY`: Key for AES-256 encryption (64 hex characters)
- `S3_BUCKET` or `GCS_BUCKET`: Storage bucket name

**OAuth (Recommended):**
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

**Optional:**
- `VERCEL_TOKEN`: For automated deployments
- `RETENTION_DAYS`: Data retention period (default: 30)
- `RATE_LIMIT_MAX_REQUESTS`: Custom rate limits

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/oauth/[provider]` - OAuth login (GitHub/Google)
- `POST /api/auth/logout` - Logout current user
- `POST /api/auth/refresh` - Refresh access token

### Portfolio Endpoints

- `POST /api/portfolio/upload-resume` - Upload encrypted resume
- `POST /api/portfolio/upload-photo` - Upload encrypted profile photo
- `POST /api/portfolio/generate` - Generate portfolio from resume
- `GET /api/portfolio/list` - List user's portfolios
- `POST /api/portfolio/publish` - Publish portfolio to production
- `DELETE /api/portfolio/[id]` - Delete portfolio

## 🚢 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Set environment variables in Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add all required variables from `.env.example`

### Custom Domain Setup

1. Add custom domain in Vercel dashboard
2. Configure DNS records as instructed
3. Enable wildcard subdomain for user portfolios: `*.yourdomain.com`

## 🛡️ Security Checklist

Before going to production:

- [ ] All environment variables set in Vercel/hosting platform
- [ ] `ENCRYPTION_KEY` is 64 hex characters (32 bytes)
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] OAuth credentials configured
- [ ] Database connection secured with SSL
- [ ] Storage bucket has proper access controls
- [ ] Rate limiting configured
- [ ] Email verification enabled
- [ ] Audit logging enabled
- [ ] Data retention policy set
- [ ] Backup strategy in place

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

This project is private and proprietary.

## 👤 Maintainer

- **Qaiser Nadeem** - [@qaiserfccu](https://github.com/qaiserfccu)

## 🆘 Support

For issues, questions, or emergency rollback:
1. Open an issue in this repository
2. Contact maintainer via GitHub
3. Check documentation in `/docs` folder

## 🔄 Emergency Rollback Procedure

If a deployment causes issues:

1. **Via Vercel Dashboard**:
   - Go to Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Via CLI**:
```bash
vercel rollback [deployment-url]
```

3. **Database Rollback**:
   - Restore from latest backup
   - Check audit logs for affected records

## 🎨 Customization

### Adding New Portfolio Themes

1. Create theme in `src/components/portfolio/themes/[theme-name]`
2. Add theme configuration to database schema
3. Update theme selector in dashboard

### Custom Resume Parsers

Add custom parsers in `src/lib/resume-parser/` for different formats.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Security Best Practices](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
