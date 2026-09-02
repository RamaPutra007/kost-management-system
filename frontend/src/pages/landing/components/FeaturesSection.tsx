import React from 'react';
import { Home, Users, FileText, CreditCard, Wallet, PieChart } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Home,
      title: "Manajemen Kamar",
      desc: "Pantau ketersediaan kamar, tipe, dan fasilitas secara real-time. Tidak ada lagi overbooking.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Users,
      title: "Data Penghuni",
      desc: "Simpan identitas, kontak darurat, dan riwayat penghuni dengan aman di cloud.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: FileText,
      title: "Sistem Kontrak",
      desc: "Digitalisasi masa sewa, syarat & ketentuan, dan notifikasi otomatis sebelum habis.",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: CreditCard,
      title: "Invoice Otomatis",
      desc: "Sistem akan membuatkan tagihan rutin setiap bulan tanpa perlu Anda hitung manual.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Wallet,
      title: "Validasi Pembayaran",
      desc: "Penghuni upload bukti bayar, Anda tinggal klik validasi. Uang langsung tercatat.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: PieChart,
      title: "Laporan Keuangan",
      desc: "Analitik untung rugi, laporan kasbulanan siap dicetak hanya dengan satu klik.",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  return (
    <section id="fitur" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Fitur Lengkap</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-navy tracking-tight max-w-3xl mx-auto">
            Segala yang Anda Butuhkan untuk Bisnis Kost
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feat.color}`}>
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
