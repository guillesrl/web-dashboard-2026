import { describe, expect, it } from 'vitest';
import { filterOrdersByPeriod } from '@/lib/orderFilters';
import type { Order } from '@/services/ordersService';

const orders: Order[] = [
  { id: 1, customer_name: 'Hoy', items: [], total: 10, status: 'pending', created_at: '2026-09-30T00:05:00.000Z' },
  { id: 2, customer_name: 'Esta semana', items: [], total: 10, status: 'pending', created_at: '2026-09-28T12:00:00.000Z' },
  { id: 3, customer_name: 'Semana pasada', items: [], total: 10, status: 'pending', created_at: '2026-09-27T12:00:00.000Z' },
];

describe('filterOrdersByPeriod', () => {
  const now = new Date('2026-09-30T00:30:00+02:00');

  it('shows only the orders created today in the business timezone', () => {
    expect(filterOrdersByPeriod(orders, 'today', now).map((order) => order.id)).toEqual([1]);
  });

  it('shows Monday through today for the current week', () => {
    expect(filterOrdersByPeriod(orders, 'week', now).map((order) => order.id)).toEqual([1, 2]);
  });

  it('keeps every order when all is selected', () => {
    expect(filterOrdersByPeriod(orders, 'all', now)).toEqual(orders);
  });
});
