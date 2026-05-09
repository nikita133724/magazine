import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const demoCustomers = [
  { id: 1, name: 'Демо клиент', phone: '+7 777 777 77 77', email: 'demo@example.com', created_at: '2026-05-09' },
];

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from('customers').select('id, name, phone, email, created_at').order('created_at', { ascending: false });
    if (!error) return NextResponse.json(data || []);
  }

  try {
    const { default: db } = await import('@/lib/db');
    const customers = db.prepare('SELECT id, name, phone, email, created_at FROM customers ORDER BY id DESC').all();
    return NextResponse.json(customers);
  } catch (error) {
    console.warn('Using demo admin customers:', error);
    return NextResponse.json(demoCustomers);
  }
}
