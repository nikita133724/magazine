import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Auth service is unavailable' }, { status: 500 });

  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  if (!email) return NextResponse.json({ exists: false });

  let page = 1;
  const perPage = 1000;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const users = data.users || [];
    if (users.some(user => String(user.email || '').toLowerCase() === email)) return NextResponse.json({ exists: true });
    if (users.length < perPage) break;
    page += 1;
  }

  return NextResponse.json({ exists: false });
}
