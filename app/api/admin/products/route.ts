import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { mapSupabaseProduct, productSelect } from '@/lib/supabase/products';

export const dynamic = 'force-dynamic';

function makeSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-|-$/g, '') || `product-${Date.now()}`;
}

async function getCategoryId(supabase: ReturnType<typeof getSupabaseAdmin>, body: any) {
  if (!supabase) return null;
  if (body.category_id) return Number(body.category_id);
  const { data } = await supabase.from('categories').select('id').eq('slug', body.category_slug || 'apparel').single();
  return data?.id || null;
}

function productPayload(body: any, categoryId: number | null) {
  return {
    slug: body.slug ? makeSlug(body.slug) : makeSlug(body.name_ru || body.name || ''),
    name_ru: body.name_ru || body.name || 'Новый товар',
    name_kz: body.name_kz || body.name_ru || body.name || 'Жаңа тауар',
    description_ru: body.description_ru || body.description || null,
    description_kz: body.description_kz || body.description_ru || body.description || null,
    price: Number(body.price || 0),
    compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : null,
    category_id: categoryId,
    sub_category_ru: body.sub_category_ru || body.sub_category || null,
    sub_category_kz: body.sub_category_kz || body.sub_category_ru || body.sub_category || null,
    main_image: body.main_image || body.image_url || null,
    stock: Number(body.stock || 0),
    status: body.status || 'active',
    is_featured: Boolean(body.is_featured),
    is_bestseller: Boolean(body.is_bestseller),
    is_new: Boolean(body.is_new),
    discount_percent: Number(body.discount_percent || 0),
  };
}

async function replaceSizes(supabase: ReturnType<typeof getSupabaseAdmin>, productId: number, body: any) {
  if (!supabase) return;
  const sizes = Array.isArray(body.sizes) ? body.sizes : String(body.sizes || 'OS').split(',').map((x: string) => x.trim()).filter(Boolean);
  await supabase.from('product_sizes').delete().eq('product_id', productId);
  if (sizes.length) await supabase.from('product_sizes').insert(sizes.map((size: string) => ({ product_id: productId, size, stock: Math.max(0, Math.floor(Number(body.stock || 0) / sizes.length)) })));
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json([]);
  const { data, error } = await supabase.from('products').select(productSelect).is('deleted_at', null).order('id', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data || []).map(mapSupabaseProduct));
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  const body = await request.json();
  const categoryId = await getCategoryId(supabase, body);
  const { data: product, error } = await supabase.from('products').insert(productPayload(body, categoryId)).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const image = body.main_image || body.image_url;
  if (image) await supabase.from('product_images').insert({ product_id: product.id, image_url: image, alt_ru: body.name_ru || body.name, sort_order: 0 });
  await replaceSizes(supabase, product.id, body);
  return NextResponse.json({ ok: true, id: product.id });
}

export async function PATCH(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  const body = await request.json();
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
  const categoryId = await getCategoryId(supabase, body);
  const { error } = await supabase.from('products').update(productPayload(body, categoryId)).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (body.main_image || body.image_url) {
    await supabase.from('product_images').delete().eq('product_id', id).eq('sort_order', 0);
    await supabase.from('product_images').insert({ product_id: id, image_url: body.main_image || body.image_url, alt_ru: body.name_ru || body.name, sort_order: 0 });
  }
  await replaceSizes(supabase, id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
  const { error } = await supabase.from('products').update({ deleted_at: new Date().toISOString(), status: 'archived' }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
