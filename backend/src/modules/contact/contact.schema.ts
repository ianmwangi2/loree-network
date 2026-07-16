import { z } from 'zod';

export const contactTopics = [
  'PRODUCT_ENQUIRY',
  'QUOTE_REQUEST',
  'TECHNICAL_SUPPORT',
  'INSTALLATION_BOOKING',
  'PARTNERSHIP',
  'OTHER'
] as const;

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  topic: z.enum(contactTopics),
  message: z.string().min(1, 'Message is required'),
  serviceId: z.string().optional()
});
