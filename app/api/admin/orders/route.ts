import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const orders = db.prepare('SELECT id, order_number, customer_name, total, payment_status, order_status, created_at FROM orders ORDER BY id DESC').all();
  return NextResponse.json(orders);
}
