import { NextResponse } from 'next/server';
import { requireRequestUser } from '@/lib/supabase/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');

    let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!data) {
      const { data: created } = await supabase.from('profiles').insert({ id: user.id, email: user.email }).select('*').single();
      data = created;
    }

    return NextResponse.json({ user: { id: user.id, email: user.email }, profile: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const body = await request.json();
    const payload = {
      id: user.id,
      email: user.email,
      full_name: body.full_name || body.fullName || '',
      phone: body.phone || '',
      city: body.city || '',
    };
    const { data, error } = await supabase.from('profiles').upsert(payload).select('*').single();
    if (error) throw error;
    return NextResponse.json({ ok: true, profile: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}
