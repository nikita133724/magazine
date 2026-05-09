'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export default function WishlistButton({ productId }: { productId: number }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  async function headers() {
    const supabase = getSupabaseBrowser();
    const session = await supabase?.auth.getSession();
    const token = session?.data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : null;
  }

  useEffect(() => {
    let ignore = false;
    headers().then(async h => {
      if (!h) return;
      const res = await fetch('/api/account/wishlist', { headers: h });
      if (!res.ok) return;
      const data = await res.json();
      if (!ignore && Array.isArray(data)) setActive(data.some((item: any) => Number(item.product_id) === productId));
    }).catch(() => {});
    return () => { ignore = true; };
  }, [productId]);

  const toggle = async () => {
    const h = await headers();
    if (!h) { router.push('/login'); return; }
    setLoading(true);
    try {
      const res = await fetch(active ? `/api/account/wishlist?product_id=${productId}` : '/api/account/wishlist', {
        method: active ? 'DELETE' : 'POST',
        headers: active ? h : { ...h, 'Content-Type': 'application/json' },
        body: active ? undefined : JSON.stringify({ product_id: productId }),
      });
      if (res.ok) setActive(prev => !prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={active ? 'Убрать из избранного' : 'Добавить в избранное'}
      disabled={loading}
      onClick={event => { event.preventDefault(); event.stopPropagation(); toggle(); }}
      className={`absolute right-3 top-3 z-10 rounded-full p-3 shadow-sm backdrop-blur transition hover:scale-105 disabled:opacity-60 ${active ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-violet-50'}`}
    >
      <Heart size={17} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
