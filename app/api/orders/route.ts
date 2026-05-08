import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { CheckoutPayload } from '@/lib/types';

export const dynamic = 'force-dynamic';

function makeOrderNumber() {
  return `THR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`;
}

export async function POST(request: Request) {
  const payload = await request.json() as CheckoutPayload;
  if (!payload.customerName || !payload.phone || !payload.city || !payload.address || !payload.items?.length) {
    return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
  }
  const total = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const orderNumber = makeOrderNumber();
  const createOrder = db.transaction(() => {
    db.prepare('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)').run(payload.customerName, payload.phone, payload.email || null);
    const result = db.prepare(`INSERT INTO orders (order_number, customer_name, phone, email, city, address, comment, total, payment_method, payment_status, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'new')`).run(orderNumber, payload.customerName, payload.phone, payload.email || null, payload.city, payload.address, payload.comment || null, total, payload.paymentMethod);
    const orderId = Number(result.lastInsertRowid);
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const item of payload.items) insertItem.run(orderId, item.id, item.name, item.size || 'OS', item.quantity, item.price, item.image || null);
    return orderId;
  });
  const orderId = createOrder();
  return NextResponse.json({ ok: true, orderId, orderNumber });
}
