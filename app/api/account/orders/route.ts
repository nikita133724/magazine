import { NextResponse } from 'next/server';
import { requireRequestUser } from '@/lib/supabase/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');

    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, phone, email, city, address, comment, total, payment_method, payment_status, order_status, created_at, order_items(id, product_id, product_name, size, quantity, price, image)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}
