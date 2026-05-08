export default function RevenueChart({ data }: { data: Array<{ day: string; revenue: number; orders: number }> }) {
  return (
    <div className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Chart</p>
      <h2 className="mb-6 text-2xl font-black uppercase italic tracking-tighter">Sales overview</h2>
      <div className="grid gap-3">
        {data.length === 0 && <p className="text-sm text-slate-500">No data yet.</p>}
        {data.map((item, index) => (
          <div key={`${item.day}-${index}`} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4"><span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.day}</span><span className="font-black">{Number(item.revenue).toLocaleString()} ₸</span></div>
            <div className="mt-3 h-2 rounded-full bg-violet-100"><div className="h-2 rounded-full bg-violet-500" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
