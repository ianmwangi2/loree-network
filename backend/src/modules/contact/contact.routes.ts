import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';
import { optionalAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createContactSchema } from './contact.schema';

const router = Router();

router.post(
  '/',
  optionalAuth,
  validateBody(createContactSchema),
  asyncHandler(async (req, res) => {
    const submission = await prisma.contactSubmission.create({
      data: { ...req.body, userId: req.user?.sub }
    });
    res.status(201).json(submission);
  })
);

export default router;
