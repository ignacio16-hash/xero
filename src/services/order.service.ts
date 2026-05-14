import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { NormalizedOrder } from '../types';

export async function upsertOrder(order: NormalizedOrder) {
  return prisma.order.upsert({
    where: {
      externalId_marketplace: {
        externalId: order.externalId,
        marketplace: order.marketplace,
      },
    },
    update: {
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      rawPayload: order.rawPayload as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
    create: {
      externalId: order.externalId,
      marketplace: order.marketplace,
      status: order.status,
      currency: order.currency,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      placedAt: order.placedAt,
      rawPayload: order.rawPayload as Prisma.InputJsonValue,
      customer: {
        create: {
          externalId: order.customer.externalId,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          street: order.customer.address.street,
          city: order.customer.address.city,
          region: order.customer.address.region,
          country: order.customer.address.country,
          zipCode: order.customer.address.zipCode,
        },
      },
      items: {
        create: order.items.map((item) => ({
          sku: item.sku,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          currency: item.currency,
        })),
      },
    },
    include: { customer: true, items: true },
  });
}

export async function getOrders(marketplace?: string, page = 1, limit = 20) {
  const where = marketplace ? { marketplace } : {};
  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { customer: true, items: true },
      orderBy: { placedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  return { data, total, page, limit };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: true },
  });
}
