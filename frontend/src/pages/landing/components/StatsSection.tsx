import React from 'react';

export function StatsSection() {
  const stats = [
    { label: 'Kamar Terkelola', value: '120+', prefix: '' },
    { label: 'Tingkat Hunian', value: '96%', prefix: '' },
    { label: 'Pendapatan / Bulan', value: '128.5M', prefix: 'Rp' },
    { label: 'Pembayaran Sukses', value: '1.240+', prefix: '' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <span className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight">
                {stat.prefix}<span className={index === 2 ? 'text-primary' : ''}>{stat.value}</span>
              </span>
              <span className="text-sm md:text-base font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
