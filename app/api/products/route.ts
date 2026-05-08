import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export interface ProductRow {
  id: number;
  name: string;
  price: number;
  category_id: number;
  category_name: string;
  sub_category: string | null;
  rating: number | null;
  image_url: string | null;
  description: string | null;
}

export async function GET() {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `).all() as ProductRow[];

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
