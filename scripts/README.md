# Development Scripts

This directory contains utility scripts for development and setup tasks.

## Available Scripts

### Image Download Scripts

#### `download-images.mjs`
Downloads project placeholder images from Unsplash.

**Usage:**
```bash
node scripts/download-images.mjs
```

**Downloads:**
- `project1.jpg` - Project showcase image
- `project2.jpg` - Project showcase image
- `project3.jpg` - Project showcase image

#### `download-github-images.mjs`
Downloads GitHub-related placeholder images from Unsplash.

**Usage:**
```bash
node scripts/download-github-images.mjs
```

**Downloads:**
- `github1.jpg` - GitHub project image
- `github2.jpg` - GitHub project image
- `github3.jpg` - GitHub project image

## Prerequisites

These scripts require the following dependencies (already in package.json):
- `axios` - For HTTP requests to download images

## Notes

- These are **development utility scripts** and are not part of the main application
- Images are downloaded to `public/images/` directory
- Downloaded images are placeholders from Unsplash and should be replaced with actual project images
- Scripts are idempotent - they will overwrite existing files with the same name
