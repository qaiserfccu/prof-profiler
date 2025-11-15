Purpose
This folder contains custom agent configurations used by GitHub Copilot CLI and related automation. Each agent file is a self-contained description of capabilities, runtime requirements, and security expectations. Do not merge an agent into the default branch until required secrets and operational controls are in place.

Runtime requirements
- Node.js: 18.x or newer
- Next.js: 13.x or newer (check the agent file's runtime block)
- Build tools: npm or pnpm, and any additional binaries declared by an agent

Required repository secrets (examples)
- VERCEL_TOKEN — Token to create deployments in Vercel (least-privilege; prefer team-scoped token)
- VERCEL_TEAM_ID — Vercel team/project identifier
- DNS_API_TOKEN — API token to create DNS records (restrict to target zone)
- STORAGE_PROVIDER — e.g., "s3" or "gcs"
- AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY — (if using S3) scoped to a single bucket
- S3_BUCKET — bucket name used for uploads
- DB_URL — connection string to a managed DB if used
- JWT_SECRET — cryptographic key for JWT signing
- ENCRYPTION_KEY — symmetric key for file encryption at rest
- OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET — if OAuth is used

How to add secrets
1. Go to your repository -> Settings -> Secrets and variables -> Actions -> New repository secret.
2. Add the keys listed above with appropriate values.
3. For organization-level tokens or highly-sensitive keys, use a Vault or organization secrets and limit access.

Secrets & permission guidance
- Use least-privilege tokens (limit scope and allowed operations).
- Rotate secrets regularly and document rotation steps.
- Do NOT commit any secret values to the repository.
- Use encrypted storage for PII and mark logs to avoid recording sensitive fields.

Local testing
- Copy .env.example to .env.local and fill required values (use test/dev keys).
- Install dependencies: npm ci
- Run locally: npm run dev
- Test uploads with presigned or mocked storage endpoints if real credentials are not available.

Deployment & publishing policy
- Agent-driven deployments that create public sites must include:
  - Preview URL for review
  - Explicit user confirmation before publish
  - Audit log entry (who, when, what)
  - An easy rollback mechanism

File structure guidelines for agent files
- Begin with YAML frontmatter containing metadata (name, description, runtime, secrets_required).
- Follow with Markdown sections documenting capabilities, security, and operational guidance.
- Keep secrets list explicit and include environment-variable examples.

Support & contact
- For questions about an agent, file an issue in the repo and @mention the maintainer(s) listed in the agent file.
- Include logs and reproduction steps for deployment/runtime issues.

Minimal checklist before merge
- Secrets provisioned and validated
- Retention and deletion policy set
- Human approval workflow for publishing configured
- Maintainer contact documented
