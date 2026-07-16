import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.serviceCategory.findMany({ orderBy: { label: 'asc' } });
    res.json(categories);
  })
);

export default router;
