export type Marketplace = 'falabella' | 'ripley' | 'paris' | 'mercadolibre' | 'shopify';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface NormalizedAddress {
  street: string;
  city: string;
  region: string;
  country: string;
  zipCode?: string;
}

export interface NormalizedCustomer {
  externalId: string;
  name: string;
  email: string;
  phone?: string;
  address: NormalizedAddress;
}

export interface NormalizedOrderItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export interface NormalizedOrder {
  externalId: string;
  marketplace: Marketplace;
  status: OrderStatus;
  customer: NormalizedCustomer;
  items: NormalizedOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  placedAt: Date;
  rawPayload: Record<string, unknown>;
}
