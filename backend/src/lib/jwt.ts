import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type JwtPayload = {
  sub: string;
  role: 'CUSTOMER' | 'ADMIN';
};

const EXPIRY_BY_ROLE: Record<JwtPayload['role'], string> = {
  CUSTOMER: '7d',
  ADMIN: '8h'
};

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: EXPIRY_BY_ROLE[payload.role] as jwt.SignOptions['expiresIn'] });

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, env.JWT_SECRET) as JwtPayload;
