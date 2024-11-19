import { AppError } from '../errorHandling';

interface RateLimitEntry {
  count: number;
  timestamp: number;
}

// Store rate limit data in memory
const rateLimits = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMITS = {
  api: { max: 100, window: 60 * 1000 }, // 100 requests per minute
  auth: { max: 5, window: 60 * 1000 }, // 5 login attempts per minute
  webhooks: { max: 30, window: 60 * 1000 }, // 30 webhook calls per minute
  comments: { max: 50, window: 60 * 1000 } // 50 comment generations per minute
};

export function checkRateLimit(key: string, type: keyof typeof RATE_LIMITS): void {
  const now = Date.now();
  const limit = RATE_LIMITS[type];
  const entry = rateLimits.get(key) || { count: 0, timestamp: now };

  // Reset count if window has passed
  if (now - entry.timestamp > limit.window) {
    entry.count = 0;
    entry.timestamp = now;
  }

  // Check if limit exceeded
  if (entry.count >= limit.max) {
    throw new AppError(
      `Rate limit exceeded for ${type}. Please try again later.`,
      'RATE_LIMIT_EXCEEDED',
      'error'
    );
  }

  // Increment counter
  entry.count++;
  rateLimits.set(key, entry);
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (now - entry.timestamp > Math.max(...Object.values(RATE_LIMITS).map(l => l.window))) {
      rateLimits.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute