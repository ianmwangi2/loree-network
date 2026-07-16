import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { toPublicUser } from '../../lib/serializers';
import { hashPassword, comparePassword } from '../../lib/password';
import { badRequest } from '../../lib/errors';
import { updateProfileSchema, changePasswordSchema } from './users.schema';

const router = Router();

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub } });
    res.json(toPublicUser(user));
  })
);

router.patch(
  '/me',
  requireAuth,
  validateBody(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({ where: { id: req.user!.sub }, data: req.body });
    res.json(toPublicUser(user));
  })
);

router.post(
  '/me/change-password',
  requireAuth,
  validateBody(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub } });

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) throw badRequest('Current password is incorrect.');

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.status(204).send();
  })
);

export default router;
