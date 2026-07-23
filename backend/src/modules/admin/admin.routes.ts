import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { toPublicUser } from '../../lib/serializers';
import { notFound } from '../../lib/errors';
import { sendQuoteReplyEmail } from '../../lib/email';
import { updateOrderStatusSchema, updateSettingsSchema, createContactReplySchema } from './admin.schema';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

// Orders
router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const orders = await prisma.order.findMany({
      where: status && status !== 'all' ? { status: status as never } : undefined,
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  })
);

router.patch(
  '/orders/:id/status',
  validateBody(updateOrderStatusSchema),
  asyncHandler(async (req, res) => {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json(order);
  })
);

// Customers
router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, orderBy: { createdAt: 'desc' } });
    res.json(users.map(toPublicUser));
  })
);

// Contact submissions
router.get(
  '/contact',
  asyncHandler(async (req, res) => {
    const handled = req.query.handled;
    const where = handled === 'true' ? { handled: true } : handled === 'false' ? { handled: false } : undefined;
    const submissions = await prisma.contactSubmission.findMany({
      where,
      include: {
        service: { select: { id: true, title: true, slug: true } },
        replies: { orderBy: { createdAt: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(submissions);
  })
);

router.patch(
  '/contact/:id',
  asyncHandler(async (req, res) => {
    const submission = await prisma.contactSubmission.update({
      where: { id: req.params.id },
      data: { handled: req.body.handled ?? true }
    });
    res.json(submission);
  })
);

router.get(
  '/contact/:id/replies',
  asyncHandler(async (req, res) => {
    const replies = await prisma.contactReply.findMany({
      where: { submissionId: req.params.id },
      orderBy: { createdAt: 'asc' }
    });
    res.json(replies);
  })
);

router.post(
  '/contact/:id/reply',
  validateBody(createContactReplySchema),
  asyncHandler(async (req, res) => {
    const submission = await prisma.contactSubmission.findUnique({ where: { id: req.params.id } });
    if (!submission) throw notFound('Enquiry not found.');

    const { message, amount } = req.body as { message: string; amount?: number };

    const reply = await prisma.contactReply.create({
      data: {
        submissionId: submission.id,
        message,
        amount,
        sentBy: req.user!.sub
      }
    });

    await prisma.contactSubmission.update({ where: { id: submission.id }, data: { handled: true } });

    res.status(201).json(reply);

    void sendQuoteReplyEmail(submission.email, submission.name, message, amount ?? null);
  })
);

// Stats
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [orders, totalUsers, totalProducts] = await Promise.all([
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count()
    ]);

    const totalRevenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.total), 0);
    const pendingOrders = orders.filter(o => o.status === 'PROCESSING').length;

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      totalUsers,
      totalProducts
    });
  })
);

// Settings
router.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
    if (!settings) throw notFound('Settings have not been configured yet.');
    res.json(settings);
  })
);

router.patch(
  '/settings',
  validateBody(updateSettingsSchema),
  asyncHandler(async (req, res) => {
    const settings = await prisma.storeSettings.update({ where: { id: 1 }, data: req.body });
    res.json(settings);
  })
);

export default router;
