import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 11;

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);

export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);
