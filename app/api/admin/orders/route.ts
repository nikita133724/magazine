import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const demoOrders = [
  { id: 1, order_number: 'THR-DEMO-1001', customer_name: 'Демо клиент', phone: '+7 777 777 77 77', total: 82000, payment_status: 'pending', order_status: 'new', created_at: '2026-05-09' },
];

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, phone, email, city, address, comment, total, payment_method, payment_status, order_status, created_at, order_items(id, product_id, product_name, size, quantity, price, image)')
      .order('created_at', { ascending: false });
    if (!error) return NextResponse.json(data || []);
  }

  try {
    const { default: db } = await import('@/lib/db');
    const orders = db.prepare('SELECT id, order_number, customer_name, phone, total, payment_status, order_status, created_at FROM orders ORDER BY id DESC').all();
    return NextResponse.json(orders);
  } catch (error) {
    console.warn('Using demo admin orders:', error);
    return NextResponse.json(demoOrders);
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: 'Order id is required' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });

  const patch: Record<string, string> = {};
  if (body.order_status) patch.order_status = body.order_status;
  if (body.payment_status) patch.payment_status = body.payment_status;

  const { error } = await supabase.from('orders').update(patch).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
