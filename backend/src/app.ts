import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import categoryRoutes from './modules/categories/categories.routes';
import serviceRoutes from './modules/services/services.routes';
import productRoutes from './modules/products/products.routes';
import orderRoutes from './modules/orders/orders.routes';
import contactRoutes from './modules/contact/contact.routes';
import adminRoutes from './modules/admin/admin.routes';

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map(o => o.trim()),
    credentials: true
  })
);
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

const api = express.Router();
api.use('/auth', authRoutes);
api.use('/users', userRoutes);
api.use('/categories', categoryRoutes);
api.use('/services', serviceRoutes);
api.use('/products', productRoutes);
api.use('/orders', orderRoutes);
api.use('/contact', contactRoutes);
api.use('/admin', adminRoutes);

app.use('/api/v1', api);

app.use(notFoundHandler);
app.use(errorHandler);
