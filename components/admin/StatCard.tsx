import type { LucideIcon } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-violet-50/50 hover:shadow-xl hover:shadow-violet-100">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Icon size={24} /></div>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tighter">{value}</p>
    </div>
  );
}
