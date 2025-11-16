# API Reference Guide

Complete API documentation for the Portfolio Generation Platform.

## Base URL

```
Production: https://yourdomain.com/api
Development: http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a valid access token sent via HTTP-only cookie or Authorization header.

### Cookie-based (Recommended)
Tokens are automatically managed via secure HTTP-only cookies after login.

### Header-based
```
Authorization: Bearer <access_token>
```

## Rate Limits

| Endpoint Category | Window | Max Requests |
|------------------|--------|--------------|
| Authentication | 15 min | 5 |
| File Upload | 1 hour | 10 |
| Deployment | 24 hours | 5 |
| General API | 15 min | 100 |

Rate limit headers are returned in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!@#",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false
  }
}
```

**Validation Rules:**
- Email: Valid email format
- Password: Minimum 12 characters, must contain uppercase, lowercase, number, and special character
- Name: Optional, 1-255 characters

**Errors:**
- `400 Bad Request`: Invalid input data
- `409 Conflict`: User already exists
- `500 Internal Server Error`: Server error

---

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!@#"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Sets HTTP-only cookies:
- `accessToken` (1 hour expiry)
- `refreshToken` (7 days expiry)

**Errors:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account deactivated or email not verified
- `429 Too Many Requests`: Rate limit exceeded

---

#### Logout

```http
POST /api/auth/logout
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

Clears authentication cookies and invalidates refresh token.

---

### File Upload

#### Upload Resume

```http
POST /api/upload/resume
Content-Type: multipart/form-data
Authorization: Required

resume: <file>
```

**Accepted File Types:**
- PDF: `application/pdf`
- DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- TXT: `text/plain`
- MD: `text/markdown`

**Max File Size:** 10MB

**Response:** `201 Created`
```json
{
  "message": "Resume uploaded and encrypted successfully",
  "resume": {
    "id": "uuid",
    "fileName": "resume.pdf",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "retentionUntil": "2024-01-31T00:00:00.000Z"
  }
}
```

**Errors:**
- `401 Unauthorized`: Not authenticated
- `400 Bad Request`: Invalid file type or size
- `429 Too Many Requests`: Upload limit exceeded

---

#### List Resumes

```http
GET /api/upload/resume
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "resumes": [
    {
      "id": "uuid",
      "fileName": "resume.pdf",
      "format": "pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "retentionUntil": "2024-01-31T00:00:00.000Z",
      "parsed": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

#### Upload Profile Photo

```http
POST /api/upload/photo
Content-Type: multipart/form-data
Authorization: Required

photo: <file>
```

**Accepted File Types:**
- JPEG: `image/jpeg`
- PNG: `image/png`
- WebP: `image/webp`

**Max File Size:** 5MB

**Response:** `201 Created`
```json
{
  "message": "Photo uploaded and encrypted successfully",
  "photo": {
    "id": "uuid",
    "fileName": "profile.jpg",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "retentionUntil": "2024-01-31T00:00:00.000Z"
  }
}
```

---

#### Get Profile Photo

```http
GET /api/upload/photo
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "photo": {
    "id": "uuid",
    "fileName": "profile.jpg",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "url": "https://cdn.example.com/photos/uuid.jpg"
  }
}
```

---

### Portfolio Management

#### Create Portfolio

```http
POST /api/portfolio
Content-Type: application/json
Authorization: Required

{
  "resumeId": "uuid",
  "photoId": "uuid",
  "username": "johndoe",
  "theme": "modern",
  "layout": "single-page",
  "consent": true
}
```

**Response:** `201 Created`
```json
{
  "message": "Portfolio created successfully",
  "portfolio": {
    "id": "uuid",
    "username": "johndoe",
    "theme": "modern",
    "status": "draft",
    "stagingUrl": "https://staging.yourdomain.com/johndoe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Themes:**
- `modern`: Clean, contemporary design
- `minimal`: Simple, text-focused
- `creative`: Bold, artistic
- `professional`: Traditional, business-oriented

**Layouts:**
- `single-page`: All content on one scrollable page
- `multi-page`: Separate pages for each section

**Errors:**
- `400 Bad Request`: Invalid input or username taken
- `403 Forbidden`: Consent not provided

---

#### List Portfolios

```http
GET /api/portfolio
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "portfolios": [
    {
      "id": "uuid",
      "username": "johndoe",
      "theme": "modern",
      "status": "published",
      "publishedUrl": "https://johndoe.yourdomain.com",
      "stagingUrl": "https://staging.yourdomain.com/johndoe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "publishedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

---

#### Get Portfolio

```http
GET /api/portfolio/:id
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "portfolio": {
    "id": "uuid",
    "username": "johndoe",
    "theme": "modern",
    "layout": "single-page",
    "status": "published",
    "publishedUrl": "https://johndoe.yourdomain.com",
    "stagingUrl": "https://staging.yourdomain.com/johndoe",
    "resume": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

#### Update Portfolio

```http
PATCH /api/portfolio/:id
Content-Type: application/json
Authorization: Required

{
  "theme": "minimal",
  "layout": "multi-page"
}
```

**Response:** `200 OK`
```json
{
  "message": "Portfolio updated successfully",
  "portfolio": {
    "id": "uuid",
    "theme": "minimal",
    "layout": "multi-page",
    "status": "draft",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

#### Publish Portfolio

```http
POST /api/portfolio/:id/publish
Content-Type: application/json
Authorization: Required

{
  "consent": true,
  "approvalConfirmed": true
}
```

**Response:** `200 OK`
```json
{
  "message": "Portfolio published successfully",
  "portfolio": {
    "id": "uuid",
    "status": "published",
    "publishedUrl": "https://johndoe.yourdomain.com",
    "publishedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Requirements:**
- User must provide explicit consent
- First-time users may require admin approval
- Staging preview must have been generated

**Errors:**
- `403 Forbidden`: Consent not provided or approval required
- `429 Too Many Requests`: Daily deployment limit exceeded

---

#### Unpublish Portfolio

```http
POST /api/portfolio/:id/unpublish
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "message": "Portfolio unpublished successfully",
  "portfolio": {
    "id": "uuid",
    "status": "archived"
  }
}
```

---

#### Delete Portfolio

```http
DELETE /api/portfolio/:id
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "message": "Portfolio deleted successfully"
}
```

Deletes portfolio metadata but preserves uploaded files per retention policy.

---

### User Management

#### Get Current User

```http
GET /api/user/me
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update User Profile

```http
PATCH /api/user/me
Content-Type: application/json
Authorization: Required

{
  "name": "John Smith"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "name": "John Smith",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

#### Request Data Export (GDPR)

```http
POST /api/user/export
Authorization: Required
```

**Response:** `202 Accepted`
```json
{
  "message": "Data export request received. You will receive an email with download link.",
  "estimatedCompletionTime": "2024-01-03T00:00:00.000Z"
}
```

---

#### Request Data Deletion (GDPR)

```http
DELETE /api/user/me
Authorization: Required

{
  "confirmation": "DELETE MY ACCOUNT"
}
```

**Response:** `202 Accepted`
```json
{
  "message": "Account deletion request received. Your data will be permanently deleted within 48 hours."
}
```

⚠️ **Warning:** This action is irreversible. All resumes, photos, and portfolios will be permanently deleted.

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid input data |
| 401 | `UNAUTHORIZED` | Authentication required |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists |
| 413 | `PAYLOAD_TOO_LARGE` | File too large |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Invalid file type |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_SERVER_ERROR` | Server error |

## Code Examples

### JavaScript/TypeScript

```typescript
// Register user
const response = await fetch('https://yourdomain.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!@#',
    name: 'John Doe',
  }),
  credentials: 'include', // Important for cookies
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

# Register user
response = requests.post(
    'https://yourdomain.com/api/auth/register',
    json={
        'email': 'user@example.com',
        'password': 'SecurePassword123!@#',
        'name': 'John Doe'
    }
)

data = response.json()
print(data)
```

### cURL

```bash
# Register user
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!@#",
    "name": "John Doe"
  }'

# Upload resume (with authentication)
curl -X POST https://yourdomain.com/api/upload/resume \
  -H "Authorization: Bearer <access_token>" \
  -F "resume=@/path/to/resume.pdf"
```

## Webhooks

Subscribe to events for real-time notifications.

### Available Events

- `portfolio.published`
- `portfolio.unpublished`
- `resume.uploaded`
- `photo.uploaded`
- `data.expiring` (7 days before retention expiry)

### Webhook Payload

```json
{
  "event": "portfolio.published",
  "timestamp": "2024-01-02T00:00:00.000Z",
  "data": {
    "portfolioId": "uuid",
    "userId": "uuid",
    "url": "https://johndoe.yourdomain.com"
  }
}
```

---

### Portfolio Public Pages

#### Get Public Portfolio Page

```http
GET /api/portfolio/public?userId={userId}&resumeId={resumeId}&pageType={pageType}
Authorization: Not Required (Public)
```

**Query Parameters:**
- `userId` (required): User ID who owns the portfolio
- `resumeId` (required): Resume ID associated with the portfolio
- `pageType` (required): Page type - one of: `home`, `about`, `portfolio`, `contact`

**Response:** `200 OK`
```json
{
  "pageType": "home",
  "title": "Home - John Doe",
  "content": {
    "heroTitle": "John Doe",
    "heroSubtitle": "Full Stack Developer",
    "heroDescription": "Passionate about creating...",
    "highlights": [
      {
        "icon": "code",
        "title": "5+ Years Experience",
        "description": "Building scalable applications"
      }
    ],
    "featuredSkills": ["JavaScript", "React", "Node.js"]
  },
  "photos": [
    "https://storage.example.com/user123/photo1.jpg",
    "https://storage.example.com/user123/photo2.jpg"
  ],
  "publicUrl": "/portfolio/user123/resume456/home"
}
```

**Error Responses:**
- `400 Bad Request`: Missing or invalid parameters
- `403 Forbidden`: Portfolio doesn't belong to specified user
- `404 Not Found`: Portfolio or page not found

---

#### Submit Contact Form

```http
POST /api/contact
Content-Type: application/json
Authorization: Not Required (Public)
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Job Opportunity",
  "message": "Hi, I would like to discuss...",
  "portfolioUserId": "user123",
  "portfolioResumeId": "resume456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Message received successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid email format
- `500 Internal Server Error`: Failed to process submission

**Notes:**
- In production, this should include rate limiting
- Currently logs submissions; email notifications to be implemented
- Message length: 10-5000 characters

---

## Public Portfolio Routes

The following routes are publicly accessible without authentication:

### Portfolio Pages

- **Home:** `/portfolio/[userId]/[resumeId]/home`
  - Hero section with photo
  - Highlights and featured skills
  - Photo gallery

- **About:** `/portfolio/[userId]/[resumeId]/about`
  - Detailed professional information
  - Experience, education, skills sections
  - Print-friendly format

- **Projects:** `/portfolio/[userId]/[resumeId]/projects`
  - Project showcase with images
  - Technology stack
  - GitHub and live demo links

- **Contact:** `/portfolio/[userId]/[resumeId]/contact`
  - Contact information
  - Working contact form
  - Availability status

All portfolio pages:
- Use dynamic gradient themes from database
- Include navigation between pages
- Show "Back to Dashboard" for authenticated owners
- Are SEO-friendly with SSR/SSG
- Support responsive design

---

## SDK Libraries

Official SDK libraries coming soon:
- JavaScript/TypeScript
- Python
- Ruby
- Go

## Support

For API support:
- Email: api-support@yourdomain.com
- Documentation: https://docs.yourdomain.com
- Status: https://status.yourdomain.com
