import { NextFunction, Request, Response } from 'express';
import { verifyToken, JwtPayload } from '../lib/jwt';
import { unauthorized, forbidden } from '../lib/errors';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(unauthorized('Missing or malformed Authorization header'));
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice('Bearer '.length));
    } catch {
      // ignore invalid/expired token on optional-auth routes
    }
  }
  next();
};

export const requireRole = (role: JwtPayload['role']) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(unauthorized());
  }
  if (req.user.role !== role) {
    return next(forbidden('You do not have permission to perform this action'));
  }
  next();
};
