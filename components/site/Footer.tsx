import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pb-28 pt-16 md:pb-16">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2"><h2 className="font-mono text-3xl font-black tracking-tighter">thrtythr.shop</h2><p className="mt-4 max-w-md text-sm leading-6 text-slate-700">Магазин одежды, обуви и аксессуаров в тёмной streetwear-эстетике.</p></div>
        <div><p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-800">Магазин</p><div className="flex flex-col gap-3 text-sm text-slate-700"><Link href="/products">Каталог</Link><Link href="/products?tag=new">Новинки</Link><Link href="/products?tag=bestseller">Хиты</Link><Link href="/checkout">Оформление</Link></div></div>
        <div><p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-800">Сервис</p><div className="flex flex-col gap-3 text-sm text-slate-700"><Link href="/">Доставка</Link><Link href="/">Возврат</Link><Link href="/products">Подбор товара</Link></div></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-screen-2xl flex-col justify-between gap-4 px-4 text-[11px] font-black uppercase tracking-widest text-slate-700 md:flex-row md:px-8"><span>© 2026 thrtythr.shop</span><span>Одежда · обувь · аксессуары</span></div>
    </footer>
  );
}
