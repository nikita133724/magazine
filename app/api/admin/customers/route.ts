import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const customers = db.prepare('SELECT id, name, phone, email, created_at FROM customers ORDER BY id DESC').all();
  return NextResponse.json(customers);
}
