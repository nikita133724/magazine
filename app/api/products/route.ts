import { NextResponse } from 'next/server';
import { fallbackProducts } from '@/lib/fallbackProducts';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getProducts } = await import('@/lib/catalog');
    const products = getProducts();
    return NextResponse.json(products.length ? products : fallbackProducts);
  } catch (error) {
    console.warn('Using fallback products because database is unavailable:', error);
    return NextResponse.json(fallbackProducts);
  }
}
