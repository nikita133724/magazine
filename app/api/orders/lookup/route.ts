import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Database is unavailable' }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const orderNumber = String(searchParams.get('order') || '').trim();

  if (!orderNumber || !/^THR-[A-Z0-9-]{6,}$/i.test(orderNumber)) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select('order_number, total, payment_status, order_status, created_at')
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  return NextResponse.json({ order: data });
}
