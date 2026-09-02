import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Wallet, Home, FileText, Calendar, Bell, ChevronRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Helper for IDR formatting
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('Rp', 'Rp ');
};

export function MyDashboard() {
  const { user } = useAuth();
  
  const { data: tagihan, isLoading: loadingTagihan, error: errTagihan } = useQuery({
    queryKey: ['my_tagihan'],
    queryFn: async () => {
      const res = await api.get('/tagihan');
      return res.data.data || res.data;
    }
  });

  const { data: kontrak, isLoading: loadingKontrak, error: errKontrak } = useQuery({
    queryKey: ['my_kontrak'],
    queryFn: async () => {
      const res = await api.get('/kontrak_sewa');
      return res.data.data || res.data;
    }
  });

  if (loadingTagihan || loadingKontrak) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Spinner className="w-10 h-10 text-primary" />
        <p className="text-slate-500 font-medium">Memuat data kamar Anda...</p>
      </div>
    );
  }

  if (errTagihan || errKontrak) {
    return (
      <div className="p-4 sm:p-6">
        <Alert variant="danger">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Terjadi kesalahan saat memuat data. Silakan refresh halaman.</p>
          </div>
        </Alert>
      </div>
    );
  }

  // Derived Data
  const activeKontrak = (Array.isArray(kontrak) ? kontrak : []).find((k: any) => k.status === 'Aktif') || null;
  
  // Tagihan logic
  const tagihanList = Array.isArray(tagihan) ? tagihan : [];
  const unpaidTagihan = tagihanList.filter((t: any) => t.status === 'Belum Lunas' || t.status === 'Sebagian');
  const paidTagihan = tagihanList.filter((t: any) => t.status === 'Lunas');
  
  const activeBill = unpaidTagihan.length > 0 ? unpaidTagihan[0] : null; // Ambil tagihan pertama yang belum lunas
  const lastPayment = paidTagihan.length > 0 ? paidTagihan[0] : null;

  // Mock Notifications for UI if API doesn't provide them
  const notifications = [
    { id: 1, title: 'Tagihan Baru', message: 'Tagihan bulan September telah terbit.', time: '2 jam yang lalu', type: 'Tagihan' },
    { id: 2, title: 'Pembayaran Diterima', message: 'Pembayaran Rp1.500.000 telah diverifikasi.', time: '1 minggu yang lalu', type: 'Pembayaran' },
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-4xl pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Mobile-Friendly */}
      <div className="bg-primary text-white rounded-b-3xl -mx-4 -mt-6 sm:-mt-8 p-6 sm:p-8 pt-10 sm:pt-12 shadow-lg mb-6 sm:rounded-3xl sm:mx-0 sm:mt-0">
        <h1 className="text-2xl font-black mb-1">Halo, {user?.name.split(' ')[0]}! 👋</h1>
        <p className="text-primary-light text-sm">Selamat datang di Kostku. Semoga harimu menyenangkan!</p>
      </div>

      <div className="px-4 sm:px-0 space-y-6">
        
        {/* Kamar Saat Ini */}
        <section>
          <h2 className="text-base font-bold text-navy mb-3 flex items-center">
            <Home className="w-4 h-4 mr-2 text-primary" /> Informasi Kamar
          </h2>
          <Card className="border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-5">
              {activeKontrak ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kamar Anda</p>
                    <h3 className="text-3xl font-black text-navy">{activeKontrak.kamar?.nomor_kamar || '-'}</h3>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      Aktif
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Harga Sewa</p>
                    <h4 className="text-xl font-bold text-primary">{formatIDR(activeKontrak.harga_kesepakatan || 0)}</h4>
                    <p className="text-xs text-slate-500 mt-1">/ bulan</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Home className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Anda belum memiliki kontrak kamar yang aktif.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Tagihan Aktif */}
        <section>
          <h2 className="text-base font-bold text-navy mb-3 flex items-center">
            <Wallet className="w-4 h-4 mr-2 text-danger" /> Tagihan Aktif
          </h2>
          {activeBill ? (
            <Card className="border-danger/20 shadow-sm bg-danger/5">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-danger">{formatIDR(activeBill.total_tagihan)}</h3>
                    <p className="text-xs font-medium text-slate-600 mt-1">Bulan {activeBill.bulan || '-'}</p>
                  </div>
                  <span className="text-xs font-bold bg-danger/10 text-danger px-2.5 py-1 rounded-full border border-danger/20">
                    Jatuh Tempo: {activeBill.tanggal_jatuh_tempo || '-'}
                  </span>
                </div>
                <Button className="w-full bg-danger hover:bg-red-600 text-white shadow-md">
                  Bayar Sekarang
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-navy text-sm">Semua Lunas!</h4>
                <p className="text-xs text-slate-500 mt-1">Anda tidak memiliki tagihan aktif saat ini.</p>
              </CardContent>
            </Card>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kontrak */}
          <section>
            <h2 className="text-base font-bold text-navy mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Detail Kontrak
            </h2>
            <Card className="border-slate-100 shadow-sm h-full">
              <CardContent className="p-5">
                {activeKontrak ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Mulai
                      </div>
                      <span className="font-bold text-navy text-sm">{activeKontrak.tanggal_mulai || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" /> Berakhir
                      </div>
                      <span className="font-bold text-navy text-sm">{activeKontrak.tanggal_selesai || '-'}</span>
                    </div>
                    <div className="pt-1">
                      <Button variant="outline" className="w-full text-xs h-9">Lihat Dokumen Kontrak</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Tidak ada data kontrak.</p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Pembayaran Terakhir */}
          <section>
            <h2 className="text-base font-bold text-navy mb-3 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-success" /> Pembayaran Terakhir
            </h2>
            <Card className="border-slate-100 shadow-sm h-full">
              <CardContent className="p-5">
                {lastPayment ? (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-bold text-navy text-sm">{formatIDR(lastPayment.total_tagihan)}</h4>
                      <p className="text-xs text-slate-500 mt-1">Bulan {lastPayment.bulan}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                        Lunas
                      </span>
                      <p className="text-xs text-slate-400 mt-1">{lastPayment.tanggal_bayar || 'Bulan ini'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Belum ada riwayat pembayaran.</p>
                )}
                
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <Button variant="ghost" className="w-full text-primary hover:text-blue-700 hover:bg-blue-50 text-xs h-9 flex justify-between px-2">
                    Lihat Riwayat Lengkap <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Notifikasi Terbaru */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-navy flex items-center">
              <Bell className="w-4 h-4 mr-2 text-warning" /> Notifikasi
            </h2>
            <span className="text-xs font-bold text-primary cursor-pointer hover:underline">Tandai sudah dibaca</span>
          </div>
          
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      notif.type === 'Tagihan' ? 'bg-danger/10' : 'bg-success/10'
                    }`}>
                      {notif.type === 'Tagihan' ? (
                        <Wallet className={`w-4 h-4 text-danger`} />
                      ) : (
                        <CheckCircle2 className={`w-4 h-4 text-success`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-navy">{notif.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] font-medium text-slate-400 mt-2 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
