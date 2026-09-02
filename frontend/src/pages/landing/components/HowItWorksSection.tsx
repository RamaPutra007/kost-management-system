import React from 'react';

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Daftarkan Kamar",
      desc: "Input data kost, tipe kamar, fasilitas, dan harganya ke dalam sistem."
    },
    {
      num: "02",
      title: "Buat Kontrak Penghuni",
      desc: "Masukkan data penghuni baru dan tentukan lama masa kontrak mereka."
    },
    {
      num: "03",
      title: "Sistem Menagih Otomatis",
      desc: "Aplikasi otomatis menagih via dashboard tiap bulan saat jatuh tempo."
    },
    {
      num: "04",
      title: "Terima Laporan Keuntungan",
      desc: "Penghuni bayar, dan Anda tinggal lihat laporan kas masuk."
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary-light font-bold tracking-wider uppercase text-sm mb-3 block">Alur Aplikasi</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Gampang. Hanya Butuh 4 Langkah.
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-700/50" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative pt-4 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-black text-primary-light mb-6 shadow-xl relative z-10">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
