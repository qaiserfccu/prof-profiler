# Database Setup Guide

This guide explains how to configure and use the Neon PostgreSQL database with the portfolio.ai application.

## Prerequisites

- A Neon account (free tier available at https://neon.tech)
- Node.js and npm installed
- Basic knowledge of environment variables

## Step 1: Create a Neon Database

1. Sign up or log in to [Neon](https://neon.tech)
2. Create a new project
3. Once created, you'll see a connection string that looks like:
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Copy this connection string

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of the project (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

2. Update the `DB_URL` in your `.env` file:
   ```env
   DB_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
   ```

3. Ensure you have these other required environment variables set:
   ```env
   JWT_SECRET=your_jwt_secret_here
   ENCRYPTION_KEY=your_encryption_key_here
   SESSION_SECRET=your_session_secret_here
   ```

   You can generate secure keys by running:
   ```bash
   npm run generate-keys
   ```

## Step 3: Test Database Connection

Test that your database connection works:

```bash
node scripts/test-db-init.mjs
```

This will:
- Verify the DB_URL is configured
- Test the connection to your database
- Show database information
- List any existing tables

## Step 4: Initialize Database Tables

Create all required tables:

```bash
npm run db:init
```

This creates the following tables:
- `users` - User accounts
- `user_portfolio_photos` - Portfolio photos (max 3 per user)
- `resumes` - Uploaded resumes (max 2 per free user)
- `generated_portfolios` - Generated portfolio sites
- `portfolio_themes` - Portfolio themes with gradients
- `portfolio_pages` - Individual portfolio pages (home, about, portfolio, contact)

## Step 5: Start the Application

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Database Schema

### Users Table
- Stores user authentication and profile information
- Password hashing using scrypt algorithm
- Email verification support

### User Portfolio Photos Table
- Stores up to 3 portfolio photos per user
- Files stored locally in `public/uploads/photos/`

### Resumes Table
- Stores up to 2 resumes per free user
- Files stored locally in `public/uploads/resumes/`
- Supports AI-generated notes

### Generated Portfolios Table
- One portfolio per resume
- Links to portfolio theme and pages

### Portfolio Themes Table
- Stores gradient CSS for each portfolio
- Random gradient generated per portfolio

### Portfolio Pages Table
- Four pages per portfolio: home, about, portfolio, contact
- AI-generated content
- Public URLs for each page

## Features

### 1. User Registration & Login
- **POST /api/auth/register**
  - Creates a new user account
  - Hashes password securely using scrypt
  - Returns JWT tokens in HTTP-only cookies

- **POST /api/auth/login**
  - Authenticates user
  - Verifies password against hash
  - Updates last login timestamp

- **POST /api/auth/logout**
  - Clears authentication cookies

### 2. Resume Upload
- **POST /api/upload/resume**
  - Uploads resume file (PDF, DOCX, TXT, MD)
  - Max file size: 10MB
  - Saves to local storage (`public/uploads/resumes/`)
  - Supports optional AI notes

- **GET /api/upload/resume**
  - Lists all user's uploaded resumes

### 3. Photo Upload
- **POST /api/upload/photo**
  - Uploads portfolio photo (JPEG, PNG, WebP)
  - Max file size: 5MB
  - Max 3 photos per user
  - Saves to local storage (`public/uploads/photos/`)

- **GET /api/upload/photo**
  - Lists all user's portfolio photos

## Local File Storage

Files are stored locally instead of AWS S3:
- **Resume files**: `public/uploads/resumes/`
- **Photo files**: `public/uploads/photos/`

Each file is named with:
- User ID
- Timestamp
- Random ID
- Original file extension

Example: `user123_1699999999999_a1b2c3d4e5f6g7h8.pdf`

## Database Migrations

If you need to update the database schema:

1. Modify `src/lib/db/schema.ts` to reflect new structure
2. Update `src/lib/db/init.ts` with new table definitions
3. Run the migration:
   ```bash
   npm run db:migrate
   ```

## Troubleshooting

### Connection Issues

**Error: "DB_URL not configured"**
- Ensure `.env` file exists and contains `DB_URL`
- Check that the connection string is complete and correct

**Error: "password authentication failed"**
- Verify username and password in the connection string
- Check that the database user has proper permissions

**Error: "ENOTFOUND" or "ECONNREFUSED"**
- Check network connectivity
- Verify the database host and port
- Ensure Neon project is active (not hibernated)

### Neon-Specific Tips

1. **Free Tier Limits**: Neon free tier includes:
   - 3 GB of storage
   - Automatically hibernates after inactivity
   - First connection after hibernation may be slow

2. **SSL Connection**: Neon requires SSL connections
   - Connection string should include `?sslmode=require`
   - Application automatically handles SSL in production mode

3. **Connection Pooling**: 
   - Max 20 connections by default
   - Connections timeout after 30 seconds of inactivity
   - Good for serverless deployments

## Security Best Practices

1. **Never commit .env file**
   - The `.env` file is in `.gitignore`
   - Use `.env.example` as a template

2. **Use strong secrets**
   - Generate random secrets using `npm run generate-keys`
   - Keep secrets private and secure

3. **Password hashing**
   - Passwords are hashed using scrypt (more secure than bcrypt)
   - Constant-time comparison prevents timing attacks

4. **JWT tokens**
   - Stored in HTTP-only cookies
   - Cannot be accessed by JavaScript
   - Automatically sent with requests

## Useful Commands

```bash
# Test database connection
node scripts/test-db-init.mjs

# Initialize database tables
npm run db:init

# Generate secure keys
npm run generate-keys

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
