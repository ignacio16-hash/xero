import { Request, Response } from 'express';
import { NormalizedOrder, OrderStatus } from '../types';
import { upsertOrder } from '../services/order.service';

// Paris status mapping — update when docs are provided
const STATUS_MAP: Record<string, OrderStatus> = {
  'pending': 'pending',
  'confirmed': 'confirmed',
  'processing': 'processing',
  'shipped': 'shipped',
  'delivered': 'delivered',
  'cancelled': 'cancelled',
};

function normalize(payload: Record<string, unknown>): NormalizedOrder {
  // TODO: replace field paths once Paris API docs are provided
  const order = payload as any;
  return {
    externalId: String(order.orderId ?? order.id),
    marketplace: 'paris',
    status: STATUS_MAP[order.status] ?? 'pending',
    customer: {
      externalId: String(order.customer?.id ?? ''),
      name: order.customer?.name ?? '',
      email: order.customer?.email ?? '',
      phone: order.customer?.phone,
      address: {
        street: order.shippingAddress?.street ?? '',
        city: order.shippingAddress?.city ?? '',
        region: order.shippingAddress?.region ?? '',
        country: order.shippingAddress?.country ?? 'CL',
        zipCode: order.shippingAddress?.zipCode,
      },
    },
    items: (order.items ?? []).map((i: any) => ({
      sku: String(i.sku ?? i.id),
      name: i.name ?? '',
      quantity: Number(i.quantity ?? 1),
      unitPrice: Number(i.unitPrice ?? i.price ?? 0),
      totalPrice: Number(i.totalPrice ?? i.quantity * i.price ?? 0),
      currency: order.currency ?? 'CLP',
    })),
    subtotal: Number(order.subtotal ?? 0),
    shippingCost: Number(order.shippingCost ?? 0),
    total: Number(order.total ?? 0),
    currency: order.currency ?? 'CLP',
    placedAt: order.createdAt ? new Date(order.createdAt) : new Date(),
    rawPayload: payload,
  };
}

export async function handleParisWebhook(req: Request, res: Response) {
  try {
    const order = await upsertOrder(normalize(req.body));
    res.status(200).json({ ok: true, orderId: order.id });
  } catch (err) {
    console.error('[paris] webhook error:', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
