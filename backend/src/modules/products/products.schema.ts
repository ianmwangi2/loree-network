import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().nonnegative(),
  inStock: z.boolean().default(true),
  image: z.string().min(1),
  description: z.string().min(1)
});

export const updateProductSchema = createProductSchema.partial();
