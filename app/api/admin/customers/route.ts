import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const demoCustomers = [
  { id: 1, name: 'Демо клиент', phone: '+7 777 777 77 77', email: 'demo@example.com', created_at: '2026-05-09' },
];

export async function GET() {
  try {
    const { default: db } = await import('@/lib/db');
    const customers = db.prepare('SELECT id, name, phone, email, created_at FROM customers ORDER BY id DESC').all();
    return NextResponse.json(customers);
  } catch (error) {
    console.warn('Using demo admin customers:', error);
    return NextResponse.json(demoCustomers);
  }
}
