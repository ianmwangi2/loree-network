import { prisma } from '../../lib/prisma';
import { badRequest } from '../../lib/errors';

const generateOrderNo = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `ORD-${year}-${Date.now().toString().slice(-6)}${rand}`;
};

export const createOrder = async (userId: string, items: { productId: string; qty: number }[]) => {
  const productIds = items.map(i => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== new Set(productIds).size) {
    throw badRequest('One or more products could not be found.');
  }

  const productById = new Map(products.map(p => [p.id, p]));
  const orderItems = items.map(item => {
    const product = productById.get(item.productId)!;
    return {
      productId: product.id,
      nameSnapshot: product.name,
      priceSnapshot: product.price,
      qty: item.qty,
      image: product.image
    };
  });

  const total = orderItems.reduce((sum, item) => sum + Number(item.priceSnapshot) * item.qty, 0);

  return prisma.order.create({
    data: {
      orderNo: generateOrderNo(),
      userId,
      total,
      items: { create: orderItems }
    },
    include: { items: true }
  });
};
