import type { Order } from '@/services/ordersService';

export type OrderPeriod = 'today' | 'week' | 'all';

const BUSINESS_TIMEZONE = 'Europe/Andorra';

function dateKeyInBusinessTimezone(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function dateKeyFromOrder(order: Order): string | null {
  const match = order.created_at?.match(/^\d{4}-\d{2}-\d{2}/);
  return match?.[0] ?? null;
}

function startOfWeek(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

export function filterOrdersByPeriod(orders: Order[], period: OrderPeriod, now = new Date()): Order[] {
  if (period === 'all') return orders;

  const today = dateKeyInBusinessTimezone(now);
  if (period === 'today') {
    return orders.filter((order) => dateKeyFromOrder(order) === today);
  }

  const weekStart = startOfWeek(today);
  return orders.filter((order) => {
    const orderDate = dateKeyFromOrder(order);
    return orderDate !== null && orderDate >= weekStart && orderDate <= today;
  });
}
