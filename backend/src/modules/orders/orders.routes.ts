import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createOrderSchema } from './orders.schema';
import { createOrder } from './orders.service';
import { forbidden, notFound } from '../../lib/errors';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.sub },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  })
);

router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!order) throw notFound('Order not found');
    if (order.userId !== req.user!.sub) throw forbidden();
    res.json(order);
  })
);

router.post(
  '/',
  requireAuth,
  validateBody(createOrderSchema),
  asyncHandler(async (req, res) => {
    const order = await createOrder(req.user!.sub, req.body.items);
    res.status(201).json(order);
  })
);

export default router;
