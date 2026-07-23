import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { prisma } from '../../lib/prisma';
import { optionalAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createAuthLimiter } from '../../middleware/rateLimit';
import { sendAdminNewEnquiryEmail, sendCustomerEnquiryConfirmationEmail } from '../../lib/email';
import { createContactSchema } from './contact.schema';

const router = Router();

router.post(
  '/',
  createAuthLimiter(),
  optionalAuth,
  validateBody(createContactSchema),
  asyncHandler(async (req, res) => {
    const submission = await prisma.contactSubmission.create({
      data: { ...req.body, userId: req.user?.sub },
      include: { service: { select: { title: true } } }
    });

    res.status(201).json(submission);

    // Fire-and-forget: don't make the customer wait on email delivery.
    void sendAdminNewEnquiryEmail({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      topic: submission.topic,
      message: submission.message,
      serviceTitle: submission.service?.title
    });
    void sendCustomerEnquiryConfirmationEmail(submission.email, submission.name);
  })
);

export default router;
