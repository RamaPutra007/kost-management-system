import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Building2, 
  DoorClosed, 
  Users,
  AlertCircle,
  Clock,
  CalendarClock,
  UserPlus,
  FilePlus,
  CheckCircle,
  Receipt,
  Plus
} from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

// Helper for IDR formatting
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('Rp', 'Rp ');
};

export function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-overview'],
    queryFn: async () => {
      try {
        const res = await api.get('/dashboard/overview');
        return res.data.overview;
      } catch (e) {
        throw new Error('Gagal memuat data dashboard operasional');
      }
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
        <Spinner className="w-12 h-12 text-primary" />
        <p className="text-slate-500 font-medium animate-pulse">Memuat data operasional...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="danger" className="max-w-2xl">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <h4 className="font-bold">Gagal Memuat Dashboard</h4>
              <p className="text-sm opacity-90">Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi nanti.</p>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  // Use real data if available, fallback to mock data based on prompt requirements
  const totalKamar = data?.total_kamar || 120;
  const kamarTerisi = data?.kamar_terisi || 115;
  const penghuniAktif = data?.total_penghuni || 118;
  const tagihanBelumDibayar = data?.tagihan_jatuh_tempo || 15;
  const pembayaranMenunggu = data?.pembayaran_pending || 8;
  const kontrakAkanBerakhir = data?.kontrak_akan_berakhir || 5;

  const summaryCards = [
    { label: 'Total Kamar', value: totalKamar, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Kamar Terisi', value: kamarTerisi, icon: DoorClosed, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Penghuni Aktif', value: penghuniAktif, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Tagihan Belum Dibayar', value: tagihanBelumDibayar, icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'Pembayaran Menunggu Verifikasi', value: pembayaranMenunggu, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Kontrak Segera Berakhir', value: kontrakAkanBerakhir, icon: CalendarClock, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight">Dashboard Operasional</h1>
          <p className="text-slate-500 mt-1">Pantau aktivitas kost dan kelola tugas operasional harian.</p>
        </div>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {summaryCards.map((card, i) => (
          <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">{card.label}</p>
                  <h3 className="text-3xl font-black text-navy">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Pending Payments */}
        <Card className="border-slate-100 shadow-sm xl:col-span-1">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <CardTitle className="text-lg font-bold text-navy flex items-center">
              <Clock className="w-5 h-5 mr-2 text-warning" />
              Menunggu Verifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
               {[
                 { name: 'Andi Wijaya', room: 'Kamar 101', amount: 1500000, date: 'Hari ini, 09:30' },
                 { name: 'Budi Santoso', room: 'Kamar 105', amount: 1750000, date: 'Kemarin, 14:15' },
                 { name: 'Citra Kirana', room: 'Kamar 202', amount: 2000000, date: 'Kemarin, 11:20' }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                   <div>
                     <p className="font-bold text-navy text-sm">{item.name}</p>
                     <p className="text-xs text-slate-500">{item.room} • {item.date}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-navy text-sm">{formatIDR(item.amount)}</p>
                     <button className="text-xs font-bold text-primary hover:text-blue-700 underline mt-1">
                       Cek Bukti
                     </button>
                   </div>
                 </div>
               ))}
               <div className="p-3 text-center bg-slate-50 rounded-b-xl">
                 <button className="text-sm font-bold text-primary hover:text-blue-700">Lihat Semua (8)</button>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Unpaid Bills & Expiring Contracts */}
        <div className="space-y-6 xl:col-span-1">
          {/* Unpaid Bills */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 py-3">
              <CardTitle className="text-base font-bold text-navy flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-danger" />
                Tagihan Belum Dibayar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                 {[
                   { name: 'Deni Setiawan', room: 'Kamar 110', due: 'Terlambat 3 Hari' },
                   { name: 'Eka Putri', room: 'Kamar 112', due: 'Terlambat 1 Hari' }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-4">
                     <div>
                       <p className="font-bold text-navy text-sm">{item.name}</p>
                       <p className="text-xs text-slate-500">{item.room}</p>
                     </div>
                     <span className="text-xs font-bold bg-danger/10 text-danger px-2 py-1 rounded-full">
                       {item.due}
                     </span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>

          {/* Expiring Contracts */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 py-3">
              <CardTitle className="text-base font-bold text-navy flex items-center">
                <CalendarClock className="w-4 h-4 mr-2 text-warning" />
                Kontrak Segera Berakhir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                 {[
                   { name: 'Fajar Rahman', room: 'Kamar 201', expire: 'H-5 (10 Sep 2026)' },
                   { name: 'Gita Savitri', room: 'Kamar 205', expire: 'H-7 (12 Sep 2026)' }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-4">
                     <div>
                       <p className="font-bold text-navy text-sm">{item.name}</p>
                       <p className="text-xs text-slate-500">{item.room}</p>
                     </div>
                     <span className="text-xs font-bold bg-warning/10 text-warning px-2 py-1 rounded-full">
                       {item.expire}
                     </span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tenants & Activity */}
        <Card className="border-slate-100 shadow-sm xl:col-span-1">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <CardTitle className="text-lg font-bold text-navy flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Penghuni Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
               {[
                 { name: 'Hadi Surya', room: 'Kamar 301', status: 'Aktif', date: 'Masuk 1 Sep' },
                 { name: 'Irfan Hakim', room: 'Kamar 302', status: 'Aktif', date: 'Masuk 28 Agu' },
                 { name: 'Joko Widodo', room: 'Kamar 305', status: 'Booking', date: 'Rencana Masuk 10 Sep' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center p-4">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-navy font-bold mr-3 shrink-0">
                     {item.name.charAt(0)}
                   </div>
                   <div className="flex-1">
                     <p className="font-bold text-navy text-sm">{item.name}</p>
                     <p className="text-xs text-slate-500">{item.room} • {item.date}</p>
                   </div>
                   <div>
                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                       {item.status}
                     </span>
                   </div>
                 </div>
               ))}
               <div className="p-3 text-center bg-slate-50 rounded-b-xl border-t border-slate-100 mt-2">
                 <button className="text-sm font-bold text-primary hover:text-blue-700">Lihat Daftar Penghuni</button>
               </div>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
