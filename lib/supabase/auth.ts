import type { User } from '@supabase/supabase-js';
import { getSupabaseAdmin } from './server';

export function getBearerToken(request: Request) {
  const header = request.headers.get('authorization') || '';
  if (!header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim() || null;
}

export async function getRequestUser(request: Request): Promise<User | null> {
  const token = getBearerToken(request);
  const supabase = getSupabaseAdmin();
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user || null;
}

export async function requireRequestUser(request: Request) {
  const user = await getRequestUser(request);
  if (!user) throw new Error('Unauthorized');
  return user;
}
