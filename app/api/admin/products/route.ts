import { NextResponse } from 'next/server';
import { fallbackProducts } from '@/lib/fallbackProducts';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { mapSupabaseProduct, productSelect } from '@/lib/supabase/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json(fallbackProducts);

  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .is('deleted_at', null)
    .order('id', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data || []).map(mapSupabaseProduct));
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });

  const body = await request.json();
  const slug = String(body.slug || body.name_ru || body.name || '').trim().toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-|-$/g, '') || `product-${Date.now()}`;

  let categoryId = body.category_id ? Number(body.category_id) : null;
  if (!categoryId) {
    const { data: category } = await supabase.from('categories').select('id').eq('slug', body.category_slug || 'apparel').single();
    categoryId = category?.id || null;
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      slug,
      name_ru: body.name_ru || body.name || 'Новый товар',
      name_kz: body.name_kz || body.name_ru || body.name || 'Жаңа тауар',
      description_ru: body.description_ru || body.description || null,
      description_kz: body.description_kz || body.description_ru || body.description || null,
      price: Number(body.price || 0),
      compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : null,
      category_id: categoryId,
      sub_category_ru: body.sub_category_ru || body.sub_category || null,
      sub_category_kz: body.sub_category_kz || body.sub_category_ru || body.sub_category || null,
      main_image: body.main_image || null,
      stock: Number(body.stock || 0),
      status: body.status || 'active',
      is_featured: Boolean(body.is_featured),
      is_bestseller: Boolean(body.is_bestseller),
      is_new: Boolean(body.is_new),
      discount_percent: Number(body.discount_percent || 0),
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const image = body.main_image || body.image_url;
  if (image) await supabase.from('product_images').insert({ product_id: product.id, image_url: image, alt_ru: body.name_ru || body.name, sort_order: 0 });

  const sizes = Array.isArray(body.sizes) ? body.sizes : String(body.sizes || 'OS').split(',').map((x: string) => x.trim()).filter(Boolean);
  if (sizes.length) {
    await supabase.from('product_sizes').insert(sizes.map((size: string) => ({ product_id: product.id, size, stock: Math.max(0, Math.floor(Number(body.stock || 0) / sizes.length)) })));
  }

  return NextResponse.json({ ok: true, id: product.id });
}
