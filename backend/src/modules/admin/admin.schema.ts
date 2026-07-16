import { z } from 'zod';
import { orderStatuses } from '../orders/orders.schema';

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses)
});

export const updateSettingsSchema = z.object({
  shopName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  currency: z.string().min(1).optional(),
  taxRate: z.number().min(0).max(100).optional()
});
