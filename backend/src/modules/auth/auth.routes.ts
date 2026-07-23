import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { validateBody } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createAuthLimiter } from '../../middleware/rateLimit';
import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from './auth.schema';
import * as authService from './auth.service';

const router = Router();

router.post(
  '/signup',
  createAuthLimiter(),
  validateBody(signupSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  })
);

router.post(
  '/login',
  createAuthLimiter(),
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.json(result);
  })
);

router.post(
  '/admin/login',
  createAuthLimiter(),
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.adminLogin(req.body);
    res.json(result);
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user!.sub);
    res.json({ user });
  })
);

router.post(
  '/verify-email',
  createAuthLimiter(),
  validateBody(verifyEmailSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.verifyEmail(req.body.token);
    res.json(result);
  })
);

router.post(
  '/resend-verification',
  createAuthLimiter(),
  validateBody(resendVerificationSchema),
  asyncHandler(async (req, res) => {
    await authService.resendVerification(req.body.email);
    res.json({ message: 'If an account with that email exists, a new verification link has been sent.' });
  })
);

router.post(
  '/forgot-password',
  createAuthLimiter(),
  validateBody(forgotPasswordSchema),
  asyncHandler(async (req, res) => {
    await authService.requestPasswordReset(req.body.email);
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  })
);

router.post(
  '/reset-password',
  createAuthLimiter(),
  validateBody(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({ message: 'Password updated. You can now log in.' });
  })
);

export default router;
