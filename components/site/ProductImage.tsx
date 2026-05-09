'use client';

import { ImageOff } from 'lucide-react';
import { useState } from 'react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({ src, alt, className = '', priority = false }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-violet-50 to-slate-200 p-6 text-center ${className}`}>
        <div className="rounded-3xl border border-violet-200 bg-white/80 p-5 shadow-sm">
          <ImageOff className="mx-auto mb-4 text-violet-700" size={30} aria-hidden="true" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-800">Фото не загружено</p>
          <p className="mt-2 line-clamp-3 text-xs font-black uppercase tracking-[0.16em] text-slate-600">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={`h-full w-full object-cover ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
