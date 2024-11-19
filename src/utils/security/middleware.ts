import { Request, Response, NextFunction } from 'express';
import { checkRateLimit } from './rateLimiting';
import { validateCSRFToken, generateCSRFToken, storeCSRFToken } from './csrf';
import { AppError } from '../errorHandling';

// CSRF Protection Middleware
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF check for GET requests and public endpoints
  if (req.method === 'GET' || req.path.startsWith('/api/public/')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  if (!token || !validateCSRFToken(token)) {
    throw new AppError('Invalid CSRF token', 'INVALID_CSRF_TOKEN', 'error');
  }

  next();
}

// Rate Limiting Middleware
export function rateLimiter(type: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${type}:${req.ip}`;
    try {
      checkRateLimit(key, type as any);
      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(429).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };
}

// Security Headers Middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // CSRF Token
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    const token = generateCSRFToken();
    storeCSRFToken(token);
    res.setHeader('X-CSRF-Token', token);
  }

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  next();
}