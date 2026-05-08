import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const demoOrders = [
  { id: 1, order_number: 'THR-DEMO-1001', customer_name: 'Демо клиент', total: 82000, payment_status: 'pending', order_status: 'new', created_at: '2026-05-09' },
];

export async function GET() {
  try {
    const { default: db } = await import('@/lib/db');
    const orders = db.prepare('SELECT id, order_number, customer_name, total, payment_status, order_status, created_at FROM orders ORDER BY id DESC').all();
    return NextResponse.json(orders);
  } catch (error) {
    console.warn('Using demo admin orders:', error);
    return NextResponse.json(demoOrders);
  }
}
