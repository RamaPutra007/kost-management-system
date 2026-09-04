import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Wallet, Home, FileText, Calendar, Bell, ChevronRight, AlertCircle, CheckCircle2, Clock, Wifi, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Using formatRupiah from utils now

export function MyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('kostku1234');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
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


  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-4xl pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Mobile-Friendly */}
      <div className="bg-primary text-white rounded-b-3xl -mx-4 -mt-6 sm:-mt-8 p-6 sm:p-8 pt-10 sm:pt-12 shadow-lg mb-6 sm:rounded-3xl sm:mx-0 sm:mt-0">
        <h1 className="text-2xl font-black mb-1">Halo, {user?.name.split(' ')[0]}! 👋</h1>
        <p className="text-primary-light text-sm">Selamat datang di Kostku. Semoga harimu menyenangkan!</p>
      </div>

      <div className="px-4 sm:px-0 space-y-6">
        
        {/* Kamar & WiFi (Grid 1 Kolom di Mobile, 2 Kolom di Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Informasi Kamar (Kiri) */}
          <section className="flex flex-col">
            <h2 className="text-sm font-bold text-navy mb-2 flex items-center">
              <Home className="w-4 h-4 mr-2 text-primary" /> Kamar
            </h2>
            <Card className="border-slate-100 shadow-sm overflow-hidden bg-white h-full hover:shadow-md transition-all">
              <CardContent className="p-5 flex flex-col justify-center h-full">
                {activeKontrak ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                        <Home className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 text-[10px] uppercase font-bold tracking-wider">
                        Aktif
                      </Badge>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Kamar Anda</p>
                      <div className="flex items-baseline space-x-2">
                        <h3 className="text-3xl font-black text-navy">{activeKontrak.kamar?.nomor_kamar || '-'}</h3>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">{activeKontrak.kamar?.tipe || '-'}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 mt-2">Rp {formatRupiah(activeKontrak.harga_kesepakatan || 0)} <span className="text-[10px] font-normal opacity-80">/bln</span></p>
                      
                      <div className="mt-4 bg-slate-50 text-slate-700 px-3 py-3 rounded-xl border border-slate-100 flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                        <div>
                          <p className="text-xs font-semibold leading-tight text-slate-600">
                            Jangka Waktu: {activeKontrak.tanggal_mulai && activeKontrak.tanggal_selesai 
                              ? Math.max(1, Math.round((new Date(activeKontrak.tanggal_selesai).getTime() - new Date(activeKontrak.tanggal_mulai).getTime()) / (1000 * 60 * 60 * 24 * 30))) 
                              : 1} Bulan
                          </p>
                          <p className="text-xs font-black leading-tight mt-1 text-navy tracking-wide">
                            Tenggat Waktu: {activeKontrak.tanggal_selesai ? new Date(activeKontrak.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                          </p>
                          <p className="text-[10px] leading-tight mt-1.5 text-slate-500">Kontrak otomatis diperpanjang saat tagihan dilunasi.</p>
                        </div>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Fasilitas Kamar</p>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                          {Array.isArray(activeKontrak.kamar?.fasilitas) 
                            ? (activeKontrak.kamar.fasilitas.map((f: any) => f.nama_fasilitas).join(', ') || '-') 
                            : (activeKontrak.kamar?.fasilitas || '-')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Home className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Belum ada kamar yang disewa</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Informasi WiFi (Kanan) */}
          <section className="flex flex-col">
            <h2 className="text-sm font-bold text-navy mb-2 flex items-center">
              <Wifi className="w-4 h-4 mr-2 text-blue-500" /> WiFi Penghuni
            </h2>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white h-full hover:shadow-md transition-all relative overflow-hidden">
              {/* Decorative background circles */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 -mr-10 -mb-10 rounded-full bg-blue-400 opacity-20"></div>
              
              <CardContent className="p-5 flex flex-col h-full justify-between relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                    <Wifi className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-400/20 text-green-100 hover:bg-green-400/30 border-0 text-[10px] uppercase font-bold tracking-wider">Terkoneksi</Badge>
                </div>
                
                <div>
                  <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider mb-1">Nama Jaringan (SSID)</p>
                  <h3 className="text-lg font-black text-white truncate mb-3" title="Kostku_Hotspot">Kostku_Hotspot</h3>
                  
                  <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider mb-1">Kata Sandi</p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 font-mono font-bold text-sm text-blue-50 w-full tracking-wide">
                      kostku1234
                    </div>
                    <Button 
                      onClick={handleCopy}
                      variant="ghost" 
                      size="icon" 
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shrink-0 h-9 w-9 rounded-lg transition-colors"
                      title="Salin Sandi"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

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
                    <h3 className="text-lg font-black text-danger">Rp {formatRupiah(activeBill.total_tagihan)}</h3>
                    <p className="text-xs font-medium text-slate-600 mt-1">Bulan {activeBill.bulan || '-'}</p>
                  </div>
                  <span className="text-xs font-bold bg-danger/10 text-danger px-2.5 py-1 rounded-full border border-danger/20">
                    Jatuh Tempo: {activeBill.tanggal_jatuh_tempo || '-'}
                  </span>
                </div>
                <Button onClick={() => navigate('/my-bills')} className="w-full bg-danger hover:bg-red-600 text-white shadow-md">
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
            <Card className="border-slate-100 shadow-sm">
              <CardContent className="p-5">
                {activeKontrak ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Mulai
                      </div>
                      <span className="font-bold text-navy text-sm">
                        {activeKontrak.tanggal_mulai 
                          ? new Date(activeKontrak.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                          : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" /> Berakhir
                      </div>
                      <span className="font-bold text-navy text-sm">
                        {activeKontrak.tanggal_selesai 
                          ? new Date(activeKontrak.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                          : '-'}
                      </span>
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
            <Card className="border-slate-100 shadow-sm">
              <CardContent className="p-5">
                {lastPayment ? (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-bold text-navy text-sm">Rp {formatRupiah(lastPayment.total_tagihan)}</h4>
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

        {/* Riwayat Sewa */}
        {(Array.isArray(kontrak) ? kontrak : []).filter((k: any) => k.status !== 'Aktif').length > 0 && (
          <section>
            <h2 className="text-base font-bold text-navy mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-slate-500" /> Riwayat Sewa (Kontrak Terdahulu)
            </h2>
            <div className="space-y-4">
              {(Array.isArray(kontrak) ? kontrak : []).filter((k: any) => k.status !== 'Aktif').map((k: any) => (
                <Card key={k.id} className="border-slate-100 shadow-sm">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-navy">Kamar {k.kamar?.nomor_kamar}</p>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{k.kamar?.tipe || '-'}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {k.tanggal_mulai ? new Date(k.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} 
                        {' s/d '} 
                        {k.tanggal_selesai ? new Date(k.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </p>
                    </div>
                    <Badge variant={k.status === 'Selesai' ? 'default' : 'danger'}>{k.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
