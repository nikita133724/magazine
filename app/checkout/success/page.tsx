'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order') || 'THR-DEMO';
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-sm md:p-12">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-violet-500">Success</p>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Order accepted</h1>
        <p className="mt-4 text-slate-500">Order number: <span className="font-black text-black">#{order}</span>. We will contact you soon.</p>
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:scale-105 hover:bg-violet-700">Back to shop</Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
