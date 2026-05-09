import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseBucket } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function extFromName(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  return ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });

  const form = await request.formData();
  const file = form.get('file');
  const productSlug = String(form.get('slug') || 'products');

  if (!(file instanceof File)) return NextResponse.json({ error: 'File is required' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });

  const bucket = getSupabaseBucket();
  const path = `${productSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extFromName(file.name)}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ ok: true, path, url: data.publicUrl });
}
