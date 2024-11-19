// Generate and validate CSRF tokens
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Store CSRF tokens in memory with expiration
const csrfTokens = new Map<string, number>();
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export function validateCSRFToken(token: string): boolean {
  const expiry = csrfTokens.get(token);
  if (!expiry) return false;

  // Check if token has expired
  if (Date.now() > expiry) {
    csrfTokens.delete(token);
    return false;
  }

  return true;
}

export function storeCSRFToken(token: string): void {
  csrfTokens.set(token, Date.now() + TOKEN_EXPIRY);
}

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of csrfTokens.entries()) {
    if (now > expiry) {
      csrfTokens.delete(token);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour