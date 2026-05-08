import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(getProducts());
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
