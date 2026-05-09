import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function cell(value: unknown) {
  return String(value ?? '').replace(/,/g, ' ').replace(/\n/g, ' ');
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  const { data, error } = await supabase.from('orders').select('order_number, customer_name, phone, email, city, address, total, payment_status, order_status, created_at').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const header = ['order_number','customer_name','phone','email','city','address','total','payment_status','order_status','created_at'];
  const rows = (data || []).map(order => header.map(key => cell((order as Record<string, unknown>)[key])).join(','));
  return new Response([header.join(','), ...rows].join('\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
