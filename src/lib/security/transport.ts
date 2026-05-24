/**
 * Transport Security — Mis Eventos Frontend
 *
 * PRODUCTION TRANSPORT
 * --------------------
 * - Frontend (Vercel) and backend (Render) are served exclusively over HTTPS.
 * - TLS encrypts the entire HTTP request/response in transit automatically.
 * - Passwords, JWT tokens, and PII travel protected by TLS — no manual AES/RSA
 *   encryption is required or recommended in the browser for this architecture.
 *
 * PASSWORD HANDLING
 * -----------------
 * - Passwords exist only in React form state (memory) during submit.
 * - They are sent once via POST over HTTPS to the backend.
 * - The backend stores password hashes (never plaintext); the frontend never
 *   persists, logs, or re-displays passwords after submission.
 *
 * JWT STORAGE
 * -----------
 * - Access tokens are stored in localStorage via Zustand persist (XSS tradeoff).
 * - Tokens are never logged to console or exposed in UI error messages.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security
 */
export const TRANSPORT_SECURITY = {
  /** Vercel serves the SPA over HTTPS in production */
  frontendUsesHttps: true,
  /** Render API base URL uses HTTPS */
  backendUsesHttps: true,
  /** Client-side encryption of passwords is NOT required when TLS is active */
  clientSidePasswordEncryption: false,
} as const
