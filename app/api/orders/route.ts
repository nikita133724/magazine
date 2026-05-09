import { NextResponse } from 'next/server';
import type { CheckoutPayload } from '@/lib/types';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function makeOrderNumber() {
  return `THR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`;
}

async function createSupabaseOrder(payload: CheckoutPayload, total: number, orderNumber: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert({ name: payload.customerName, phone: payload.phone, email: payload.email || null })
    .select('id')
    .single();

  if (customerError) throw customerError;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: customer?.id || null,
      customer_name: payload.customerName,
      phone: payload.phone,
      email: payload.email || null,
      city: payload.city,
      address: payload.address,
      comment: payload.comment || null,
      total,
      delivery_method: payload.deliveryMethod || 'courier',
      payment_method: payload.paymentMethod || 'cash_on_delivery',
      payment_status: 'pending',
      order_status: 'new',
    })
    .select('id')
    .single();

  if (orderError) throw orderError;

  const items = payload.items.map(item => ({
    order_id: order.id,
    product_id: item.id || null,
    product_name: item.name,
    size: item.size || 'OS',
    quantity: item.quantity,
    price: item.price,
    image: item.image || null,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(items);
  if (itemsError) throw itemsError;

  return order.id;
}

export async function POST(request: Request) {
  const payload = await request.json() as CheckoutPayload;
  if (!payload.customerName || !payload.phone || !payload.city || !payload.address || !payload.items?.length) {
    return NextResponse.json({ error: 'Missing order fields' }, { status: 400 });
  }

  const total = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const orderNumber = makeOrderNumber();

  try {
    const supabaseOrderId = await createSupabaseOrder(payload, total, orderNumber);
    if (supabaseOrderId) return NextResponse.json({ ok: true, orderId: supabaseOrderId, orderNumber, persisted: true, database: 'supabase' });
  } catch (error) {
    console.warn('Supabase order failed:', error);
  }

  try {
    const { default: db } = await import('@/lib/db');
    const createOrder = db.transaction(() => {
      db.prepare('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)').run(payload.customerName, payload.phone, payload.email || null);
      const result = db.prepare('INSERT INTO orders (order_number, customer_name, phone, email, city, address, comment, total, payment_method, payment_status, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(orderNumber, payload.customerName, payload.phone, payload.email || null, payload.city, payload.address, payload.comment || null, total, payload.paymentMethod, 'pending', 'new');
      const orderId = Number(result.lastInsertRowid);
      const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
      for (const item of payload.items) insertItem.run(orderId, item.id, item.name, item.size || 'OS', item.quantity, item.price, item.image || null);
      return orderId;
    });
    const orderId = createOrder();
    return NextResponse.json({ ok: true, orderId, orderNumber, persisted: true, database: 'sqlite' });
  } catch (error) {
    console.warn('Order accepted without database:', error);
    return NextResponse.json({ ok: true, orderId: null, orderNumber, persisted: false });
  }
}
