import db from '@/lib/db';
import type { Category, Product, ProductImage, ProductSize } from '@/lib/types';

interface ProductRow {
  id: number;
  slug: string | null;
  name: string;
  price: number;
  compare_at_price: number | null;
  category_id: number;
  category_name: string;
  category_slug: string;
  sub_category: string | null;
  rating: number | null;
  image_url: string | null;
  main_image: string | null;
  description: string | null;
  stock: number | null;
  status: string | null;
  is_featured: number | null;
  is_bestseller: number | null;
  is_new: number | null;
  discount_percent: number | null;
  created_at: string | null;
  updated_at: string | null;
}

function getImages(productId: number) {
  return db.prepare('SELECT id, product_id, image_url, alt, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC').all(productId) as ProductImage[];
}

function getSizes(productId: number) {
  return db.prepare('SELECT id, product_id, size, stock FROM product_sizes WHERE product_id = ? ORDER BY id ASC').all(productId) as ProductSize[];
}

export function mapProduct(row: ProductRow): Product {
  const images = getImages(row.id);
  const mainImage = row.main_image || row.image_url || images[0]?.image_url || null;
  return {
    id: row.id,
    slug: row.slug || String(row.id),
    name: row.name,
    price: Number(row.price),
    compare_at_price: row.compare_at_price,
    category_id: row.category_id,
    category_name: row.category_name,
    category_slug: row.category_slug,
    sub_category: row.sub_category,
    rating: Number(row.rating ?? 4.5),
    description: row.description,
    main_image: mainImage,
    image_url: mainImage,
    stock: Number(row.stock ?? 0),
    status: (row.status || 'active') as Product['status'],
    is_featured: Boolean(row.is_featured),
    is_bestseller: Boolean(row.is_bestseller),
    is_new: Boolean(row.is_new),
    discount_percent: Number(row.discount_percent ?? 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
    images: images.length > 0 ? images : mainImage ? [{ id: 0, product_id: row.id, image_url: mainImage, alt: row.name, sort_order: 0 }] : [],
    sizes: getSizes(row.id),
  };
}

export function getProducts() {
  const rows = db.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'active'
    ORDER BY p.is_bestseller DESC, p.is_new DESC, p.id ASC
  `).all() as ProductRow[];
  return rows.map(mapProduct);
}

export function getProductById(id: number) {
  const row = db.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(id) as ProductRow | undefined;
  return row ? mapProduct(row) : null;
}

export function getCategories() {
  return db.prepare('SELECT id, name, slug, description FROM categories ORDER BY name ASC').all() as Category[];
}
