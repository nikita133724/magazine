import { NextResponse } from 'next/server';
import { requireRequestUser } from '@/lib/supabase/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.from('customer_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).order('id', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const body = await request.json();
    const payload = { user_id: user.id, title: body.title || 'Основной адрес', city: body.city || 'Алматы', address: body.address || '', is_default: Boolean(body.is_default) };
    if (!payload.address) return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    if (payload.is_default) await supabase.from('customer_addresses').update({ is_default: false }).eq('user_id', user.id);
    const { data, error } = await supabase.from('customer_addresses').insert(payload).select('*').single();
    if (error) throw error;
    return NextResponse.json({ ok: true, address: data });
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
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: 'Address id is required' }, { status: 400 });
    if (body.is_default) await supabase.from('customer_addresses').update({ is_default: false }).eq('user_id', user.id);
    const { data, error } = await supabase.from('customer_addresses').update({ title: body.title, city: body.city, address: body.address, is_default: Boolean(body.is_default) }).eq('id', id).eq('user_id', user.id).select('*').single();
    if (error) throw error;
    return NextResponse.json({ ok: true, address: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireRequestUser(request);
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase is not configured');
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Address id is required' }, { status: 400 });
    const { error } = await supabase.from('customer_addresses').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}
