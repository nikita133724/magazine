import type { Product } from '@/lib/types';

function toNumber(value: unknown, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function mapImage(row: any) {
  return {
    id: Number(row.id),
    product_id: Number(row.product_id),
    image_url: String(row.image_url || ''),
    alt: row.alt_ru || row.alt_kz || null,
    sort_order: Number(row.sort_order || 0),
  };
}

function mapSize(row: any) {
  return {
    id: Number(row.id),
    product_id: Number(row.product_id),
    size: String(row.size || 'OS'),
    stock: Number(row.stock || 0),
  };
}

export function mapSupabaseProduct(row: any): Product {
  const category = row.categories || {};
  const images = Array.isArray(row.product_images) ? row.product_images.map(mapImage) : [];
  const sizes = Array.isArray(row.product_sizes) ? row.product_sizes.map(mapSize) : [];
  const mainImage = row.main_image || images[0]?.image_url || null;

  return {
    id: Number(row.id),
    slug: String(row.slug || row.id),
    name: String(row.name_ru || row.name_kz || row.slug || ''),
    name_ru: row.name_ru,
    name_kz: row.name_kz,
    price: toNumber(row.price),
    compare_at_price: row.compare_at_price == null ? null : toNumber(row.compare_at_price),
    category_id: Number(row.category_id || 0),
    category_name: String(category.name_ru || category.name_kz || ''),
    category_slug: String(category.slug || ''),
    sub_category: row.sub_category_ru || row.sub_category_kz || null,
    sub_category_ru: row.sub_category_ru,
    sub_category_kz: row.sub_category_kz,
    rating: toNumber(row.rating, 4.8),
    description: row.description_ru || row.description_kz || null,
    description_ru: row.description_ru,
    description_kz: row.description_kz,
    main_image: mainImage,
    image_url: mainImage,
    stock: Number(row.stock || 0),
    status: row.status || 'active',
    is_featured: Boolean(row.is_featured),
    is_bestseller: Boolean(row.is_bestseller),
    is_new: Boolean(row.is_new),
    discount_percent: Number(row.discount_percent || 0),
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
    images,
    sizes,
  };
}

export const productSelect = `
  *,
  categories(id, slug, name_ru, name_kz),
  product_images(id, product_id, image_url, alt_ru, alt_kz, sort_order),
  product_sizes(id, product_id, size, stock)
`;
