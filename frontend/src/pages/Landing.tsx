import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Building2, Users, Receipt, Wallet, PieChart, 
  CheckCircle2, ShieldCheck, Zap, ArrowRight, 
  Smartphone, Monitor, CreditCard, Clock, Star, 
  TrendingUp, Home, Settings
} from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                KostMaster
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Fitur</a>
              <a href="#alur" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Alur Aplikasi</a>
              <a href="#showcase" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Showcase</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')} className="font-semibold text-slate-700">
                Masuk
              </Button>
              <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20">
                Mulai Gratis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-600">Sistem Manajemen Kost No. 1 di Indonesia</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Kelola Bisnis Kost Anda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Lebih Mudah & Otomatis
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Tinggalkan pencatatan manual. Pantau ketersediaan kamar, tagihan penghuni, hingga laporan keuangan dalam satu dashboard pintar.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30" onClick={() => navigate('/login')}>
              Coba Sekarang <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white">
              Lihat Demo Interaktif
            </Button>
          </div>

          {/* Hero Dashboard Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
            <div className="rounded-2xl border border-slate-200/50 bg-white/50 p-2 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
                {/* Mockup Browser Header */}
                <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto w-1/2 h-5 bg-white rounded-md border border-slate-200"></div>
                </div>
                {/* Mockup Content */}
                <div className="flex h-[500px]">
                  {/* Sidebar */}
                  <div className="w-64 bg-slate-900 p-4 flex flex-col space-y-2">
                    <div className="h-8 w-32 bg-slate-800 rounded mb-6"></div>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`h-10 rounded flex items-center px-3 ${i === 0 ? 'bg-blue-600' : 'bg-slate-800/50'}`}>
                        <div className="w-5 h-5 bg-white/20 rounded mr-3"></div>
                        <div className="h-3 w-24 bg-white/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                  {/* Main content */}
                  <div className="flex-1 p-6 bg-slate-50 flex flex-col space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-48 bg-slate-200 rounded"></div>
                      <div className="h-10 w-32 bg-blue-600 rounded-lg"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-blue-100 mb-3"></div>
                          <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
                          <div className="h-4 w-20 bg-slate-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="h-6 w-40 bg-slate-200 rounded mb-6"></div>
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-12 bg-slate-50 rounded border border-slate-100 flex items-center px-4 justify-between">
                            <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                            <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                            <div className="h-6 w-20 bg-green-100 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements on Hero Mockup */}
            <div className="absolute -left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-4 animate-bounce hover:pause z-20">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Pembayaran Valid</p>
                <p className="text-xs text-slate-500">Rp 1.500.000 - Kamar A1</p>
              </div>
            </div>
            
            <div className="absolute -right-10 bottom-1/3 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-4 animate-pulse z-20">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Kontrak Baru</p>
                <p className="text-xs text-slate-500">Budi Santoso - Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST STATISTICS */}
      <section className="py-10 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <p className="text-4xl font-extrabold text-slate-900">500+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Kost Terdaftar</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-600">10k+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Kamar Terkelola</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-slate-900">Rp 50M+</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Transaksi Aman</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-green-500">99.9%</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Uptime Server</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ALUR APLIKASI */}
      <section id="alur" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Satu Alur Jelas untuk Bisnis Anda</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Dari kamar kosong hingga laporan keuangan bulanan, semua terhubung secara otomatis.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
              {[
                { icon: Building2, title: 'Kamar', desc: 'Kelola data dan fasilitas', color: 'bg-blue-100 text-blue-600' },
                { icon: Users, title: 'Penghuni', desc: 'Data penyewa aman', color: 'bg-indigo-100 text-indigo-600' },
                { icon: ShieldCheck, title: 'Kontrak', desc: 'Masa sewa terpantau', color: 'bg-purple-100 text-purple-600' },
                { icon: Receipt, title: 'Tagihan', desc: 'Generate otomatis', color: 'bg-amber-100 text-amber-600' },
                { icon: Wallet, title: 'Pembayaran', desc: 'Verifikasi instan', color: 'bg-green-100 text-green-600' },
                { icon: PieChart, title: 'Laporan', desc: 'Analisis laba rugi', color: 'bg-slate-200 text-slate-700' },
              ].map((step, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${step.color}`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOWCASE APLIKASI - FITUR UNGGULAN */}
      <section id="showcase" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Showcase Multi-Role Dashboard</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Dibangun dengan keamanan tingkat tinggi. Setiap role memiliki akses yang disesuaikan dengan kebutuhan spesifiknya.
            </p>
          </div>

          {/* Showcase 1: Admin/Owner */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
            <div className="w-full lg:w-1/2 order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-blue-600/5 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-2">
                <div className="bg-slate-900 rounded-xl p-4 flex gap-4 h-[400px]">
                  <div className="w-1/4 border-r border-slate-700 space-y-3 pt-2">
                    <div className="w-3/4 h-4 bg-slate-700 rounded"></div>
                    <div className="w-full h-8 bg-blue-600 rounded"></div>
                    <div className="w-full h-8 bg-slate-800 rounded"></div>
                    <div className="w-full h-8 bg-slate-800 rounded"></div>
                  </div>
                  <div className="w-3/4 bg-slate-50 rounded-lg p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1 bg-white p-3 rounded shadow-sm border border-slate-200">
                        <div className="w-8 h-8 rounded bg-green-100 mb-2"></div>
                        <div className="w-20 h-4 bg-slate-200 rounded"></div>
                      </div>
                      <div className="flex-1 bg-white p-3 rounded shadow-sm border border-slate-200">
                        <div className="w-8 h-8 rounded bg-amber-100 mb-2"></div>
                        <div className="w-20 h-4 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-full h-32 bg-white border border-slate-200 rounded shadow-sm p-4">
                      <div className="w-full h-4 bg-slate-100 rounded mb-2"></div>
                      <div className="w-full h-4 bg-slate-100 rounded mb-2"></div>
                      <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Owner & Admin Area
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Kendali Penuh di Tangan Anda</h3>
              <p className="text-slate-600 mb-8 text-lg">
                Pantau seluruh operasional bisnis kost dari satu layar. Ketahui total pendapatan bulan ini, kamar yang kosong, hingga pengeluaran operasional sekecil apapun.
              </p>
              <ul className="space-y-4">
                {[
                  'Manajemen multi-kost dan puluhan kamar.',
                  'Verifikasi pembayaran dari penghuni dengan 1 klik.',
                  'Laporan laba rugi otomatis (Chart visual).'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Showcase 2: Penghuni */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Portal Penghuni
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Kenyamanan Ekstra Bagi Penyewa</h3>
              <p className="text-slate-600 mb-8 text-lg">
                Penghuni tidak perlu lagi bertanya "Berapa tagihan bulan ini?". Mereka memiliki portal login sendiri untuk melihat tagihan, kontrak, dan lapor pembayaran.
              </p>
              <ul className="space-y-4">
                {[
                  'Dashboard pribadi untuk setiap penghuni (Terproteksi IDOR).',
                  'Upload bukti transfer langsung via web/mobile.',
                  'Riwayat sewa dan pembayaran transparan.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-emerald-600/5 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              
              {/* Mobile Phone Mockup */}
              <div className="mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-t-[2.5rem]"></div>
                <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col">
                  {/* App Header */}
                  <div className="bg-emerald-600 p-6 pt-10 text-white rounded-b-3xl shadow-sm">
                    <p className="text-emerald-100 text-sm">Hi, Budi Santoso</p>
                    <p className="font-bold text-xl">Kamar A1 - VIP</p>
                  </div>
                  {/* App Content */}
                  <div className="flex-1 p-4 space-y-4 overflow-hidden">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-1">Tagihan Belum Dibayar</p>
                      <p className="text-2xl font-bold text-red-600">Rp 1.500.000</p>
                      <button className="mt-3 w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-medium">Bayar Sekarang</button>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-2">Riwayat Terakhir</p>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <div>
                          <p className="text-sm font-bold">Agustus 2026</p>
                          <p className="text-xs text-slate-400">Transfer Bank</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Lunas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. FEATURES GRID */}
      <section id="fitur" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Lengkap Skala Enterprise</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Meskipun bisnis Anda baru dimulai, gunakan sistem standar industri yang aman dan mutakhir.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'Responsive 100%', desc: 'Akses lancar dari PC kasir, laptop, iPad, maupun HP Android/iOS.' },
              { icon: ShieldCheck, title: 'Keamanan Data Ekstra', desc: 'Proteksi CSRF, Anti-DDoS (Rate Limiting), dan Enkripsi Password Bcrypt.' },
              { icon: Zap, title: 'Performa Tinggi (SPA)', desc: 'Navigasi tanpa loading berkat teknologi React + Vite + React Query.' },
              { icon: PieChart, title: 'Laporan Laba Rugi', desc: 'Sistem otomatis mengkalkulasi selisih pembayaran penyewa vs pengeluaran operasional.' },
              { icon: Clock, title: 'Jatuh Tempo Otomatis', desc: 'Pembuatan tagihan otomatis saat kontrak akan berakhir. Tidak ada lagi kelupaan menagih.' },
              { icon: Settings, title: 'Role Based Access', desc: 'Batasi akses Admin (staf) agar tidak bisa menghapus data sensitif milik Owner.' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800 transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Pertanyaan Populer</h2>
          <div className="space-y-4">
            {[
              { q: 'Apakah sistem ini aman untuk data KTP penghuni?', a: 'Sangat aman. Backend kami dikembangkan menggunakan standar keamanan Laravel 13 dengan enkripsi penuh dan sistem validasi ketat. Akses data juga terisolasi antar penghuni.' },
              { q: 'Bagaimana jika saya punya lebih dari 1 lokasi Kost?', a: 'Sistem ini dirancang mendukung Multi-Kost. Anda bisa menambahkan banyak properti Kost dan mengelola kamarnya dalam satu akun Owner yang sama.' },
              { q: 'Apakah penghuni harus download aplikasi di PlayStore?', a: 'Tidak perlu. KostMaster adalah Web-App modern yang sangat responsif. Penghuni cukup membuka URL web di browser HP mereka layaknya aplikasi native.' },
              { q: 'Apakah bisa mencatat pengeluaran seperti token listrik dan PDAM?', a: 'Tentu. Tersedia modul Pengeluaran dengan kategorisasi khusus untuk mempermudah pelacakan beban operasional Kost Anda.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-4xl font-extrabold mb-6">Siap Mengembangkan Bisnis Kost Anda?</h2>
          <p className="text-xl text-blue-100 mb-10">Bergabunglah dengan ratusan juragan kost yang sudah lebih dulu beralih ke era digital.</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-50 h-16 px-10 text-lg rounded-full shadow-2xl shadow-blue-900/50" onClick={() => navigate('/login')}>
            Mulai Gunakan KostMaster
          </Button>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-800 pb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  KostMaster
                </span>
              </div>
              <p className="max-w-md text-sm">
                Sistem Informasi Manajemen Kost yang memberikan kemudahan pencatatan, penagihan, hingga laporan laba rugi. Solusi SaaS terbaik di Indonesia.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimoni</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Release Notes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Panduan Pengguna</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak Kami</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2026 Kost Management System. Hak Cipta Dilindungi.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span>Dibuat dengan Laravel & React</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
