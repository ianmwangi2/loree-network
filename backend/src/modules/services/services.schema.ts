import { z } from 'zod';

const detailSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1)
});

export const createServiceSchema = z.object({
  slug: z.string().min(1),
  categoryId: z.string().min(1),
  title: z.string().min(1),
  shortDesc: z.string().min(1),
  heroImage: z.string().min(1),
  overview: z.string().min(1),
  details: z.array(detailSchema).default([]),
  features: z.array(z.string()).default([])
});

export const updateServiceSchema = createServiceSchema.partial();
