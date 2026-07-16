import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createProductSchema, updateProductSchema } from './products.schema';
import { notFound } from '../../lib/errors';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'asc' } });
    res.json(products);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } });
    if (!product) throw notFound('Product not found');
    res.json(product);
  })
);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(createProductSchema),
  asyncHandler(async (req, res) => {
    const product = await prisma.product.create({ data: req.body, include: { category: true } });
    res.status(201).json(product);
  })
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(updateProductSchema),
  asyncHandler(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
      include: { category: true }
    });
    res.json(product);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
