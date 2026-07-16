import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { badRequest } from '../lib/errors';

export const validateBody = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(badRequest(result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')));
  }
  req.body = result.data;
  next();
};
