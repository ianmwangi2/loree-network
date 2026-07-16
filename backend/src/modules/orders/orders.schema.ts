import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().positive()
      })
    )
    .min(1, 'At least one item is required')
});

export const orderStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses)
});
