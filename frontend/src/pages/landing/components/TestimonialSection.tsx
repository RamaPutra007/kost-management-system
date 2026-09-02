import React from 'react';
import { Star } from 'lucide-react';

export function TestimonialSection() {
  const testimonials = [
    {
      quote: "Sejak pakai KOSTKU, tagihan nggak pernah ada yang terlewat. Semua otomatis masuk ke laporan. Admin saya juga lebih mudah kerja.",
      author: "Budi Santoso",
      role: "Owner, 45 Kamar - Jakarta Selatan"
    },
    {
      quote: "Dulu sering ribut soal bukti transfer hilang. Sekarang tinggal upload via aplikasi, langsung tervalidasi. Sangat menghemat waktu!",
      author: "Siti Rahma",
      role: "Admin Kost, 120 Kamar - Yogyakarta"
    },
    {
      quote: "Sebagai penghuni, enak banget bisa lihat sisa kontrak dan tagihan bulanan dari HP. Pembayaran juga jadi lebih transparan.",
      author: "Andi Wijaya",
      role: "Penghuni Kost"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Dipercaya Oleh Pemilik Kost se-Indonesia
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testi, i) => (
            <div key={i} className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
              <div className="flex text-amber-400 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-300 italic mb-8">"{testi.quote}"</p>
              <div>
                <p className="font-bold text-white">{testi.author}</p>
                <p className="text-sm text-slate-400">{testi.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
