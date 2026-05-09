import { NextResponse } from 'next/server';
import { fallbackProducts } from '@/lib/fallbackProducts';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { mapSupabaseProduct, productSelect } from '@/lib/supabase/products';

export const dynamic = 'force-dynamic';

async function getSupabaseProducts() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('is_bestseller', { ascending: false })
    .order('is_new', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapSupabaseProduct);
}

export async function GET() {
  try {
    const supabaseProducts = await getSupabaseProducts();
    if (supabaseProducts && supabaseProducts.length > 0) return NextResponse.json(supabaseProducts);
  } catch (error) {
    console.warn('Supabase products unavailable:', error);
  }

  try {
    const { getProducts } = await import('@/lib/catalog');
    const products = getProducts();
    return NextResponse.json(products.length ? products : fallbackProducts);
  } catch (error) {
    console.warn('Using fallback products because database is unavailable:', error);
    return NextResponse.json(fallbackProducts);
  }
}
