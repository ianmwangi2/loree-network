import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../lib/password';
import { signToken } from '../../lib/jwt';
import { toPublicUser } from '../../lib/serializers';
import { conflict, unauthorized } from '../../lib/errors';

type SignupInput = { name: string; email: string; phone?: string; password: string };
type LoginInput = { email: string; password: string };

export const signup = async ({ name, email, phone, password }: SignupInput) => {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    throw conflict('An account with this email already exists.');
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), phone, passwordHash, role: 'CUSTOMER' }
  });

  const token = signToken({ sub: user.id, role: user.role });
  return { user: toPublicUser(user), token };
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
