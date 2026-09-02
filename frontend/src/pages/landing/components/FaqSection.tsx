import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah data saya aman?",
      a: "Ya, kami menggunakan enkripsi standar industri dan server cloud terpercaya untuk menjamin keamanan database penghuni dan keuangan Anda."
    },
    {
      q: "Berapa kapasitas maksimal kamar yang bisa ditambahkan?",
      a: "Tidak ada batasan (unlimited). Anda dapat menambahkan berapapun kamar yang Anda kelola tanpa biaya tambahan per kamar."
    },
    {
      q: "Apakah penghuni harus mendownload aplikasi?",
      a: "Tidak perlu. Penghuni cukup mengakses portal melalui browser di HP mereka (web-based) untuk melihat tagihan dan sisa kontrak."
    },
    {
      q: "Bagaimana sistem notifikasi otomatis bekerja?",
      a: "Sistem akan otomatis mendeteksi tagihan yang belum dibayar atau kontrak yang akan habis, dan menampilkan indikator merah pada dashboard Admin & Penghuni."
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-navy tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={cn(
                "bg-white border rounded-2xl overflow-hidden transition-all duration-300",
                openIndex === i ? "border-primary shadow-lg shadow-primary/5" : "border-slate-200 hover:border-slate-300"
              )}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-bold text-navy text-lg pr-4">{faq.q}</span>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0",
                    openIndex === i ? "rotate-180 text-primary" : ""
                  )} 
                />
              </button>
              
              <div 
                className={cn(
                  "px-6 overflow-hidden transition-all duration-300",
                  openIndex === i ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
