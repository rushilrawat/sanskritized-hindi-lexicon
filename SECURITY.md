# Security Policy

## Supported Versions

The current maintained version is:

```text
2.x
```

## Reporting a Vulnerability

If you find a security issue, please do not disclose it publicly before it can
be reviewed.

Report vulnerabilities through GitHub security advisories if available, or by
contacting the maintainer through the repository owner profile.

Please include:

- a clear description of the issue
- reproduction steps
- affected files or routes
- potential impact
- suggested mitigation, if known

## Scope

This is a static client-side web application. Relevant reports may include:

- unsafe rendering
- dependency vulnerabilities
- data injection risks
- privacy issues involving localStorage or browser APIs
- build or deployment misconfiguration

## Current Security Controls

The production deployment sends security headers through `vercel.json`:

- Content Security Policy restricting scripts, frames, forms, connections, and
  media to the application origin (with `data:`/`blob:` only where the browser
  APIs and local assets require them)
- HSTS with subdomains and preload
- MIME sniffing protection (`X-Content-Type-Options`)
- Clickjacking protection (`frame-ancestors` and `X-Frame-Options`)
- Strict referrer and permissions policies
- Cross-origin opener isolation

The React application renders dictionary data and user input as text. It does
not use `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or remote API calls.
Search and replacement input is length-limited before processing, and browser
storage is treated as untrusted client state rather than authentication data.

## Server-Side Controls Required Before Adding a Backend

This repository currently has no server, database, login, or state-changing
HTTP endpoint. SQL injection prevention, CSRF tokens, request rate limiting,
and honeypot bot detection therefore cannot be meaningfully implemented in the
static bundle. If a backend is introduced, it must:

1. Use parameterized queries or a vetted ORM for every database query. Never
   concatenate request data into SQL.
2. Validate and normalize input at the server boundary, then encode output for
   its context. Keep the CSP and remove any need for unsafe script execution.
3. Use SameSite, Secure, HttpOnly cookies and an origin-checked CSRF token for
   every cookie-authenticated state-changing request.
4. Apply per-IP and per-account rate limits at the edge and API layer, with
   bounded request bodies and timeouts. Return generic errors to clients.
5. Add a hidden, accessible honeypot field only to public forms and reject
   submissions that fill it. Treat it as a signal, not a sole anti-abuse
   control; combine it with rate limits and logging.
6. Add integration tests for authorization, injection payloads, CSRF, limits,
   and security headers before exposing the endpoint publicly.

Do not put secrets, API keys, authorization decisions, or trusted user data in
the client bundle or localStorage.

## Privacy and Data Compliance Boundary

The current app has no accounts, authentication, analytics, advertising,
cookies, remote API calls, or server-side user profile. Preferences,
bookmarks, learning progress, and Replace text are stored only in the user's
browser localStorage. The Privacy page provides a control to clear those
known keys.

The project does not claim GDPR, UK GDPR, CCPA/CPRA, LGPD, PIPEDA, POPIA, or
DPDP Act certification. The public policy pages describe the current data
flows and rights boundary. A future backend must add a data inventory, lawful
bases, retention schedule, deletion/export workflows, regional disclosures,
processor agreements, and server-side rate limiting before collecting personal
data or creating accounts.
