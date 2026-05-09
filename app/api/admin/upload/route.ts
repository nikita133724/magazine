import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseBucket } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type UploadFile = File & { arrayBuffer: () => Promise<ArrayBuffer>; name: string; type: string; size: number };

function extFromName(name: string, type: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return ext;
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/gif') return 'gif';
  return 'jpg';
}

function storagePath(file: UploadFile) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).slice(2);
  return `products/${year}/${month}/${Date.now()}-${random}.${extFromName(file.name, file.type)}`;
}

async function ensureBucket(supabase: ReturnType<typeof getSupabaseAdmin>, bucket: string) {
  if (!supabase) return;
  const { data } = await supabase.storage.getBucket(bucket);
  if (data) return;
  await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });

  const form = await request.formData();
  const maybeFile = form.get('file');

  if (!maybeFile || typeof maybeFile !== 'object' || !('arrayBuffer' in maybeFile)) {
    return NextResponse.json({ error: 'Файл не получен. Выберите изображение ещё раз.' }, { status: 400 });
  }

  const file = maybeFile as UploadFile;
  if (!file.type || !file.type.startsWith('image/')) return NextResponse.json({ error: 'Можно загружать только изображения.' }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Файл слишком большой. Максимум 10 MB.' }, { status: 400 });

  const bucket = getSupabaseBucket();
  try {
    await ensureBucket(supabase, bucket);
  } catch (error) {
    console.warn('Could not ensure storage bucket:', error);
  }

  const path = storagePath(file);
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    console.error('Supabase upload failed:', error);
    return NextResponse.json({ error: `Ошибка загрузки в Storage: ${error.message}` }, { status: 400 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ ok: true, path, url: data.publicUrl });
}
