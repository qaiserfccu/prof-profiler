# Development Guide

This document outlines the development workflow and file organization for this portfolio project.

## Project Structure

### Main Application Files (Production)
These are the core portfolio application files that are deployed:

- **`src/app/*`** - Next.js pages (home, about, portfolio, contact)
- **`src/components/*`** - React components (UI, layout)
- **`src/data/*`** - Data files (projects, experiences)
- **`public/images/*`** - Portfolio images and assets
- **Configuration files** - `next.config.*`, `tailwind.config.js`, etc.

### Development/Utility Files (Tasks)
These are helper scripts and tools for development workflow:

- **`scripts/`** - Utility scripts
  - `download-images.mjs` - Script to download project images from Unsplash
  - `download-github-images.mjs` - Script to download GitHub-related images

## Development Workflow

### Setting Up Images

The project includes utility scripts to download placeholder images:

```bash
# Download project images
node scripts/download-images.mjs

# Download GitHub-related images
node scripts/download-github-images.mjs
```

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

## File Organization Best Practices

1. **Main application files** are in `src/` and should be committed
2. **Utility scripts** are in `scripts/` for development tasks
3. **Personal images** in `public/images/IMG_*.{PNG,JPG}` might be personal and should be reviewed before committing
4. **Generated assets** should be added to `.gitignore` if auto-generated

## Contributing

When creating PRs:
- Focus on specific features or fixes
- Keep utility scripts separate from application logic
- Document any new scripts or tools in this file
- Test changes locally before committing
