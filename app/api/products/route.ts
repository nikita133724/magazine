import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { mapSupabaseProduct, productSelect } from '@/lib/supabase/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured', products: [] }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('is_bestseller', { ascending: false })
    .order('is_new', { ascending: false })
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message, products: [] }, { status: 500 });
  return NextResponse.json((data || []).map(mapSupabaseProduct));
}
