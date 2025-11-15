
name: rao-profile description: "Expert agent that generates production-ready portfolio websites from Resume/CV data using Next.js, HTML/CSS, and modern UI techniques." version: 0.1.0 author: qaiserfccu maintainers:

qaiserfccu runtime: node: ">=18.x" next: "13.x or newer" inputs: resume_formats:
pdf
docx
md profile_photo: true additional_text: true capabilities:
nextjs_scaffolding: true
horizontal_scroll_support: true
modern_ui_ux: true
animations_and_shaders: true
vercel_deployment: true
subdomain_routing: true
mcp_integration: optional # requires manual approval/credentials security_requirements: secrets_required:
VERCEL_TOKEN
VERCEL_TEAM_ID
DNS_API_TOKEN
STORAGE_PROVIDER # e.g., "s3" or "gcs"
S3_BUCKET (if using s3)
AWS_ACCESS_KEY_ID (if using s3)
AWS_SECRET_ACCESS_KEY (if using s3)
DB_URL # if using an external database
JWT_SECRET
ENCRYPTION_KEY # for PII encryption at rest
OAUTH_CLIENT_ID (optional)
OAUTH_CLIENT_SECRET (optional) storage_requirements:
Passwords MUST NOT be stored in plaintext.
Use salted & iterated hashing (bcrypt/argon2) for credentials.
PII (resumes, photos) MUST be encrypted at rest using ENCRYPTION_KEY.
Secrets MUST be stored in GitHub Actions secrets, Vault, or equivalent. permissions: required:
dns:write (scoped, least privilege)
deployment:create (scoped to target team/project)
storage:write (scoped to the bucket used) notes:
