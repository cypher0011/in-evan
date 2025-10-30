/**
 * Token Generation Utilities for Guest Check-in
 * Generates secure, unique 8-10 character alphanumeric tokens
 */

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; // Removed ambiguous: 0,O,I,1,l
const TOKEN_LENGTH = 9; // 9 characters provides good balance of usability and uniqueness

/**
 * Generate a cryptographically secure random token
 * Format: Uppercase + Lowercase + Numbers (no ambiguous characters)
 * Example: A13FB9K2M
 */
export function generateGuestToken(length: number = TOKEN_LENGTH): string {
  // Use Web Crypto API for secure random generation
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let token = '';
  for (let i = 0; i < length; i++) {
    token += CHARSET[array[i] % CHARSET.length];
  }

  return token;
}

/**
 * Validate token format
 * Must be 8-10 alphanumeric characters (no special chars)
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  const length = token.length;
  if (length < 8 || length > 10) return false;

  // Check if token only contains alphanumeric characters
  return /^[A-Za-z0-9]+$/.test(token);
}

/**
 * Generate a unique token and check against existing tokens
 * This should be called with database check to ensure uniqueness
 */
export async function generateUniqueToken(
  checkExists: (token: string) => Promise<boolean>,
  maxAttempts: number = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const token = generateGuestToken();
    const exists = await checkExists(token);

    if (!exists) {
      return token;
    }
  }

  throw new Error('Failed to generate unique token after maximum attempts');
}

/**
 * Generate guest session token (longer, more secure)
 * Used for /guest-app access after check-in completion
 */
export function generateSessionToken(): string {
  // 32 character token for session security
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate token expiration date
 * Typically check-out date + 1 day (for late checkout scenarios)
 */
export function calculateTokenExpiration(checkOutDate: Date): Date {
  const expiration = new Date(checkOutDate);
  expiration.setDate(expiration.getDate() + 1); // Add 1 day buffer
  expiration.setHours(23, 59, 59, 999); // End of day
  return expiration;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: Date | string): boolean {
  const expirationDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return expirationDate < new Date();
}

/**
 * Format token for URL display
 * Example: A13FB9K2M -> a13fb9k2m (or keep as-is for case-sensitive)
 */
export function formatTokenForUrl(token: string): string {
  // Keep original case for case-sensitive tokens
  return token;
}

/**
 * Parse token from URL
 * Handles case sensitivity
 */
export function parseTokenFromUrl(token: string): string {
  return token.trim();
}

// Example usage:
// const token = generateGuestToken(); // => "A13FB9K2M"
// const isValid = isValidTokenFormat(token); // => true
// const sessionToken = generateSessionToken(); // => "a1b2c3d4e5f6..."
