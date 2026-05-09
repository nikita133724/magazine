import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-16 text-center">
      <div className="max-w-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-violet-800">404</p>
        <h1 className="mt-4 text-6xl font-black uppercase italic tracking-tighter md:text-8xl">Страница не найдена</h1>
        <p className="mt-6 text-base leading-7 text-slate-700">Такой страницы нет или она была перемещена. Вернитесь в каталог и продолжите выбор товаров.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-black px-7 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-800">На главную</Link>
          <Link href="/products" className="rounded-full border border-slate-300 px-7 py-4 text-xs font-black uppercase tracking-widest text-black transition hover:bg-violet-50">В каталог</Link>
        </div>
      </div>
    </main>
  );
}
