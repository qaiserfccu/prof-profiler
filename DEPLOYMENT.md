# Deployment Instructions

## Environment Variables Setup

The application requires environment variables to function properly. These must be configured differently for development and production environments.

### Local Development

1. Create a `.env.local` file in the project root (this file is gitignored and will not be committed):

```bash
# Generate secure secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex')); console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'));"
```

2. Copy the output and create `.env.local`:

```env
# Authentication & Security
JWT_SECRET=your_generated_jwt_secret_here
ENCRYPTION_KEY=your_generated_encryption_key_here
SESSION_SECRET=your_session_secret_minimum_32_characters_long_random_string

# Node Environment
NODE_ENV=development
```

3. Run the development server:
```bash
npm run dev
```

### Production Deployment (Vercel)

**IMPORTANT**: Environment variables must be configured in Vercel's dashboard, NOT in the codebase.

#### Step 1: Generate Secure Keys

Run this command locally to generate secure keys:

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex')); console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'));"
```

Copy the generated keys - you'll need them in the next step.

#### Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables (click "Add Another" for each):

| Name | Value | Environment |
|------|-------|-------------|
| `JWT_SECRET` | (paste the generated JWT_SECRET) | Production, Preview, Development |
| `ENCRYPTION_KEY` | (paste the generated ENCRYPTION_KEY) | Production, Preview, Development |
| `SESSION_SECRET` | (any 32+ character random string) | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

5. Click **Save** for each variable

#### Step 3: Redeploy

After adding environment variables, you must redeploy for changes to take effect:

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**
4. Choose **Use existing Build Cache** (optional)
5. Click **Redeploy**

Alternatively, push a new commit to trigger automatic redeployment.

### Verifying Environment Variables

To verify environment variables are loaded correctly:

1. Visit your deployed site
2. Try to register a new user
3. If you see "Server configuration error. Please contact administrator." - the JWT_SECRET is not set correctly
4. Go back to Vercel dashboard and verify:
   - JWT_SECRET is added
   - It's enabled for the correct environment (Production)
   - You've redeployed after adding it

### Troubleshooting

**Error: "Server configuration error. Please contact administrator."**

This means JWT_SECRET is not configured. Check:

1. ✅ Environment variable is added in Vercel dashboard
2. ✅ Environment variable name is exactly `JWT_SECRET` (case-sensitive)
3. ✅ Environment variable is enabled for Production environment
4. ✅ You've redeployed after adding the variable

**Error: "Internal server error"**

This is a generic error. Check Vercel logs:

1. Go to your Vercel project
2. Click on **Deployments**
3. Click on the latest deployment
4. Click on **Functions** tab
5. Find the failed API route (e.g., `/api/auth/login`)
6. Check the logs for specific error messages

### Security Best Practices

1. **Never commit `.env.local` or `.env` files** - they are gitignored for security
2. **Use different secrets for each environment** (development, staging, production)
3. **Rotate secrets periodically** - generate new keys every 90 days
4. **Keep secrets minimum 32 characters** for adequate security
5. **Use Vercel's encrypted environment variables** - they are encrypted at rest

### Quick Setup Script

For convenience, you can run this to generate all necessary secrets at once:

```bash
node scripts/generate-env.js
```

This will output a complete `.env.local` template with generated secrets.

## Authentication System

The application uses JWT-based authentication with the following features:

- **Login/Register pages**: Available at `/login` and `/register`
- **Password requirements**: Minimum 5 characters (simplified for demo)
- **Protected routes**: All `/family/*` routes require authentication with 'superuser' or 'admin' role
- **Public routes**: `/`, `/personal/*`, `/login`, `/register`, `/contact` are accessible without authentication
- **Session management**: Uses HTTP-only cookies for security

### Default Behavior

- All registered users automatically receive 'superuser' role (demo mode)
- No actual password hashing in demo mode (add in production)
- No database connection required (uses in-memory demo mode)

### Production Readiness Checklist

Before deploying to production with real users:

- [ ] Set up proper database (PostgreSQL/MongoDB)
- [ ] Implement password hashing (bcrypt/scrypt)
- [ ] Add email verification flow
- [ ] Implement password reset functionality
- [ ] Add rate limiting middleware
- [ ] Set up proper user role management
- [ ] Enable audit logging
- [ ] Configure CORS properly
- [ ] Set up monitoring and error tracking
- [ ] Add HTTPS redirect
- [ ] Configure proper session expiry
- [ ] Implement CSRF protection

## Need Help?

If you continue experiencing issues:

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure you've redeployed after adding environment variables
4. Open an issue in the repository with:
   - Screenshot of the error
   - Vercel deployment logs
   - Confirmation that environment variables are set
