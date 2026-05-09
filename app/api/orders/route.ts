import { NextResponse } from 'next/server';
import type { CheckoutPayload } from '@/lib/types';
import { getRequestUser } from '@/lib/supabase/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function makeOrderNumber() {
  return `THR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`;
}

async function createSupabaseOrder(payload: CheckoutPayload, total: number, orderNumber: string, request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const user = await getRequestUser(request);

  if (user?.id) {
    await supabase.from('profiles').upsert({ id: user.id, email: user.email, full_name: payload.customerName, phone: payload.phone, city: payload.city });
  }

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert({ user_id: user?.id || null, name: payload.customerName, phone: payload.phone, email: payload.email || user?.email || null })
    .select('id')
    .single();

  if (customerError) throw customerError;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id || null,
      order_number: orderNumber,
      customer_id: customer?.id || null,
      customer_name: payload.customerName,
      phone: payload.phone,
      email: payload.email || user?.email || null,
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
    const supabaseOrderId = await createSupabaseOrder(payload, total, orderNumber, request);
    if (supabaseOrderId) return NextResponse.json({ ok: true, orderId: supabaseOrderId, orderNumber, persisted: true, database: 'supabase' });
  } catch (error) {
    console.warn('Supabase order failed:', error);
    return NextResponse.json({ error: 'Не удалось сохранить заказ' }, { status: 500 });
  }

  return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
}
