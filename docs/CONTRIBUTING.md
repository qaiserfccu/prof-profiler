# Contributing Guide

Thank you for considering contributing to the Portfolio Generation Platform! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Security](#security)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows a professional code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Prioritize security and privacy
- Follow best practices and standards

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- PostgreSQL or MongoDB (for local development)
- AWS CLI or Google Cloud SDK (for storage testing)

### Local Setup

1. **Fork the repository**
   ```bash
   gh repo fork qaiserfccu/rao-muhammad --clone
   cd rao-muhammad
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your local configuration.

4. **Generate secrets**
   ```bash
   # Generate encryption key
   node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate JWT secret
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:3000 in your browser

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. Write code following our [coding standards](#coding-standards)
2. Add or update tests
3. Update documentation
4. Commit with meaningful messages
5. Push and create a pull request

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `security`: Security improvements

**Examples:**
```
feat(auth): add OAuth2 GitHub login

Implement GitHub OAuth2 authentication flow with secure token management.

Closes #123
```

```
fix(upload): validate file size before encryption

Prevent large file uploads that could cause memory issues.

Fixes #456
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define explicit types (avoid `any`)
- Use interfaces for complex types
- Document public APIs with JSDoc comments

**Example:**
```typescript
/**
 * Hash a password using scrypt
 * @param password - Plain text password
 * @returns Hashed password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  // Implementation
}
```

### React/Next.js

- Use functional components with hooks
- Prefer server components when possible
- Use `'use client'` directive only when necessary
- Implement proper error boundaries
- Follow React best practices

**Component Structure:**
```typescript
'use client';

import { useState } from 'react';

interface Props {
  userId: string;
  onComplete: () => void;
}

export function UploadForm({ userId, onComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  
  // Implementation
  
  return (
    <form>
      {/* JSX */}
    </form>
  );
}
```

### File Organization

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── portfolio/         # Portfolio pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── db/               # Database utilities
│   ├── security/         # Security utilities
│   ├── storage/          # File storage
│   └── utils/            # General utilities
└── types/                 # TypeScript type definitions
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`UserProfile`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Maximum line length: 100 characters
- Use async/await instead of promises
- Add blank lines between logical sections

**Run linter:**
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for all new features
- Update tests when modifying existing code
- Aim for 80%+ code coverage
- Use descriptive test names

**Test Structure:**
```typescript
import { hashPassword, verifyPassword } from '@/lib/security/auth';

describe('Password hashing', () => {
  it('should hash password securely', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    
    expect(hash).toBeTruthy();
    expect(hash).not.toBe(password);
    expect(hash).toContain('scrypt$');
  });
  
  it('should verify correct password', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    
    expect(isValid).toBe(true);
  });
  
  it('should reject incorrect password', async () => {
    const hash = await hashPassword('correct');
    const isValid = await verifyPassword('wrong', hash);
    
    expect(isValid).toBe(false);
  });
});
```

### Integration Tests

Test API endpoints with real requests:

```typescript
import { POST } from '@/app/api/auth/register/route';

describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPassword123!',
        name: 'Test User',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.user.email).toBe('test@example.com');
  });
});
```

## Security

### Security Guidelines

1. **Never commit secrets** - Use environment variables
2. **Validate all input** - Sanitize user data
3. **Use parameterized queries** - Prevent SQL injection
4. **Encrypt PII** - Use AES-256-GCM
5. **Hash passwords** - Use scrypt or argon2
6. **Rate limit** - Prevent abuse
7. **Audit log** - Track sensitive operations

### Security Review Checklist

Before submitting security-related PRs:

- [ ] No secrets in code
- [ ] Input validation implemented
- [ ] Output encoding applied
- [ ] Authentication checked
- [ ] Authorization verified
- [ ] Rate limiting applied
- [ ] Audit logging added
- [ ] Error messages don't leak info
- [ ] Dependencies updated
- [ ] Security tests added

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Report security issues privately:
- Email: security@yourdomain.com
- PGP key: [Link to PGP key]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Pull Request Process

### Before Submitting

1. **Update from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git rebase develop
   ```

2. **Run checks**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Update documentation**
   - Update README if needed
   - Add API documentation
   - Update CHANGELOG

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Security
- [ ] No secrets committed
- [ ] Security review completed
- [ ] No new vulnerabilities

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests passing
- [ ] No console errors
- [ ] Reviewed own code
```

### Review Process

1. Automated checks run (lint, tests, build)
2. At least one maintainer reviews
3. Feedback addressed
4. Approved and merged

### After Merge

- Delete feature branch
- Update local develop branch
- Close related issues

## Development Tips

### Debugging

```typescript
// Use debug logging
console.log('[DEBUG]', { userId, action });

// Use TypeScript type checking
npm run type-check

// Use Next.js debugging
DEBUG=* npm run dev
```

### Performance

- Use React.memo for expensive components
- Implement proper caching
- Optimize images (Next.js Image component)
- Minimize bundle size
- Use code splitting

### Common Issues

**Build fails with font errors:**
- Internet required for Google Fonts
- Use local fonts in development if offline

**Database connection issues:**
- Check .env.local configuration
- Verify database is running
- Check firewall rules

**Storage upload fails:**
- Verify AWS/GCS credentials
- Check bucket permissions
- Ensure bucket exists

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Project Wiki](https://github.com/qaiserfccu/rao-muhammad/wiki)

## Questions?

- Open a [Discussion](https://github.com/qaiserfccu/rao-muhammad/discussions)
- Check [FAQ](https://github.com/qaiserfccu/rao-muhammad/wiki/FAQ)
- Email: dev@yourdomain.com

Thank you for contributing! 🎉
