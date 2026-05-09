import { NextResponse } from 'next/server';
import { requireRequestUser } from '@/lib/supabase/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { mapSupabaseProduct, productSelect } from '@/lib/supabase/products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`id, product_id, created_at, products(${productSelect})`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const items = (data || []).map((item: any) => ({ id: item.id, product_id: item.product_id, created_at: item.created_at, product: item.products ? mapSupabaseProduct(item.products) : null })).filter((item: any) => item.product);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const body = await request.json();
    const productId = Number(body.product_id || body.productId);
    if (!productId) return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
    const { error } = await supabase.from('wishlist_items').upsert({ user_id: user.id, product_id: productId }, { onConflict: 'user_id,product_id' });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const { searchParams } = new URL(request.url);
    const productId = Number(searchParams.get('product_id'));
    if (!productId) return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
    const { error } = await supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', productId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}
