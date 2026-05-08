'use client';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="px-4 py-3 transition hover:bg-violet-50">-</button>
      <span className="min-w-12 text-center text-sm font-black">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="px-4 py-3 transition hover:bg-violet-50">+</button>
    </div>
  );
}
