'use client';

import AdminShell from '@/components/admin/AdminShell';

export default function AdminCategoriesPage() {
  const categories = ['Одежда', 'Обувь', 'Аксессуары'];
  return (
    <AdminShell title="Категории">
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map(category => <div key={category} className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black uppercase italic tracking-tighter">{category}</h2><p className="mt-3 text-sm text-slate-700">Раздел каталога для управления товарами.</p></div>)}
      </div>
    </AdminShell>
  );
}
