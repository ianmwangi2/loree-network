import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../lib/password';
import { signToken } from '../../lib/jwt';
import { toPublicUser } from '../../lib/serializers';
import { generateToken, hashToken } from '../../lib/tokens';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../lib/email';
import { conflict, unauthorized, forbidden, badRequest } from '../../lib/errors';

type SignupInput = { name: string; email: string; phone?: string; password: string };
type LoginInput = { email: string; password: string };

const VERIFICATION_TOKEN_TTL_MS = 48 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const issueVerificationEmail = async (userId: string, email: string, name: string) => {
  const token = generateToken();
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS) }
  });
  await sendVerificationEmail(email, name, token);
};

export const signup = async ({ name, email, phone, password }: SignupInput) => {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    throw conflict('An account with this email already exists.');
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), phone, passwordHash, role: 'CUSTOMER' }
  });

  await issueVerificationEmail(user.id, user.email, user.name);

  return { user: toPublicUser(user), requiresVerification: true };
};

const authenticate = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw unauthorized('Invalid email or password.');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw unauthorized('Invalid email or password.');
  }

  if (!user.emailVerified) {
    throw forbidden('Please verify your email before logging in.');
  }

  return user;
};

export const login = async (input: LoginInput) => {
  const user = await authenticate(input);
  const token = signToken({ sub: user.id, role: user.role });
  return { user: toPublicUser(user), token };
};

export const adminLogin = async (input: LoginInput) => {
  const user = await authenticate(input);
  if (user.role !== 'ADMIN') {
    throw unauthorized('Invalid admin credentials.');
  }
  const token = signToken({ sub: user.id, role: user.role });
  return { user: toPublicUser(user), token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return toPublicUser(user);
};

export const verifyEmail = async (rawToken: string) => {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!record || record.expiresAt < new Date()) {
    throw badRequest('This verification link is invalid or has expired.');
  }

  const user = await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true }
  });

  await prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } });

  const token = signToken({ sub: user.id, role: user.role });
  return { user: toPublicUser(user), token };
};

export const resendVerification = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user && !user.emailVerified) {
    await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });
    await issueVerificationEmail(user.id, user.email, user.name);
  }
  // Always respond the same way whether or not the account exists, or is already verified,
  // so this endpoint can't be used to enumerate registered/unverified emails.
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    const token = generateToken();
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) }
    });
    await sendPasswordResetEmail(user.email, user.name, token);
  }
  // Always respond the same way whether or not the account exists — avoids email enumeration.
};

export const resetPassword = async (rawToken: string, newPassword: string) => {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw badRequest('This reset link is invalid or has expired.');
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })
  ]);
};
