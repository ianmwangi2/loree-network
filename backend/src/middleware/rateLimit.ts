import rateLimit from 'express-rate-limit';

// Each call creates an independent limiter (own counter store), so separate
// auth endpoints (e.g. customer login vs admin login) can't exhaust each
// other's attempt budget when hit from the same IP.
export const createAuthLimiter = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts. Please try again later.' }
  });
