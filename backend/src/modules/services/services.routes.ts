import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createServiceSchema, updateServiceSchema } from './services.schema';
import { notFound } from '../../lib/errors';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const services = await prisma.service.findMany({
      where: category && category !== 'all' ? { categoryId: category } : undefined,
      include: { category: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(services);
  })
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
      include: { category: true }
    });
    if (!service) throw notFound('Service not found');
    res.json(service);
  })
);

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(createServiceSchema),
  asyncHandler(async (req, res) => {
    const service = await prisma.service.create({ data: req.body, include: { category: true } });
    res.status(201).json(service);
  })
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(updateServiceSchema),
  asyncHandler(async (req, res) => {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
      include: { category: true }
    });
    res.json(service);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
