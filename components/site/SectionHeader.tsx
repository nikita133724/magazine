import Link from 'next/link';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  href?: string;
  action?: string;
}

export default function SectionHeader({ eyebrow, title, href = '/products', action = 'Смотреть все' }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-700">{eyebrow}</p>}
        <h2 className="text-3xl font-black uppercase italic tracking-tighter sm:text-5xl lg:text-6xl">{title}</h2>
      </div>
      <Link href={href} className="w-fit border-b-2 border-black pb-1 text-[11px] font-black uppercase tracking-[0.16em] text-black transition-colors hover:border-violet-700 hover:text-violet-800">
        {action}
      </Link>
    </div>
  );
}
