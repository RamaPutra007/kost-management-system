import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { showAlert } from '@/lib/utils';
import { Settings, Building2, Bell, CreditCard, Shield, Save, Wifi, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';

export function Pengaturan() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('umum');
  
  // Modals state
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  
  const [bankFormData, setBankFormData] = useState({ nama_provider: '', nomor_rekening: '', atas_nama: '' });
  
  const [qrisFormData, setQrisFormData] = useState({ nama_provider: '', instruksi: '' });
  const [qrisFile, setQrisFile] = useState<File | null>(null);

  const [kostData, setKostData] = useState<any>({
    nama: '',
    alamat: '',
    no_telepon: '',
    email: '',
    settings: {
      pembayaran_tanggal_jatuh_tempo: 5,
      pembayaran_denda_keterlambatan: 50000,
      wifi_aktif: true,
      wifi_ssid: '',
      wifi_password: '',
      wifi_instruksi: '',
      notifikasi_tagihan_baru: true,
      notifikasi_pembayaran_berhasil: true,
      notifikasi_h3_jatuh_tempo: true,
      notifikasi_kontrak_habis: true,
      keamanan_2fa: false,
      keamanan_sesi_hari: 30
    }
  });

  const { data: fetchedKost, isLoading: isKostLoading } = useQuery({
    queryKey: ['kost', 1],
    queryFn: async () => {
      const res = await api.get('/kost/1');
      return res.data;
    }
  });

  useEffect(() => {
    if (fetchedKost) {
      setKostData({
        ...fetchedKost,
        settings: {
          ...kostData.settings,
          ...(fetchedKost.settings || {})
        }
      });
    }
  }, [fetchedKost]);

  const updateKostMutation = useMutation({
    mutationFn: async (data: any) => await api.put('/kost/1', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kost', 1] });
      showAlert.success('Pengaturan sistem berhasil disimpan!');
    },
    onError: () => showAlert.error('Gagal menyimpan pengaturan')
  });

  const handleSaveSettings = () => {
    updateKostMutation.mutate(kostData);
  };

  const { data: paymentMethods, isLoading: isPaymentLoading } = useQuery({
    queryKey: ['payment_methods'],
    queryFn: async () => {
      const res = await api.get('/payment_methods');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      // payload could be FormData (for QRIS) or normal object
      const config = payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      return await api.post('/payment_methods', payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods'] });
      showAlert.success('Metode pembayaran berhasil ditambahkan');
      setIsBankModalOpen(false);
      setIsQrisModalOpen(false);
      setBankFormData({ nama_provider: '', nomor_rekening: '', atas_nama: '' });
      setQrisFormData({ nama_provider: '', instruksi: '' });
      setQrisFile(null);
    },
    onError: () => showAlert.error('Gagal menambahkan metode pembayaran')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/payment_methods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods'] });
      showAlert.success('Metode pembayaran dihapus');
    }
  });

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...bankFormData, tipe: 'Bank', kost_id: 1 }); // Assuming kost_id 1
  };

  const handleAddQris = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('tipe', 'QRIS');
    fd.append('kost_id', '1');
    fd.append('nama_provider', qrisFormData.nama_provider);
    fd.append('instruksi', qrisFormData.instruksi);
    if (qrisFile) fd.append('qr_image', qrisFile);
    createMutation.mutate(fd);
  };

  const tabs = [
    { id: 'umum', label: 'Umum', icon: <Building2 className="w-4 h-4" /> },
    { id: 'pembayaran', label: 'Pembayaran', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'wifi', label: 'Jaringan WiFi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'notifikasi', label: 'Notifikasi', icon: <Bell className="w-4 h-4" /> },
    { id: 'keamanan', label: 'Keamanan', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Pengaturan Sistem</h1>
          <p className="text-slate-500 mt-1">Konfigurasi properti kos, integrasi, dan preferensi aplikasi.</p>
        </div>
        <Button 
          className="flex items-center space-x-2 w-full sm:w-auto" 
          onClick={handleSaveSettings}
          isLoading={updateKostMutation.isPending}
        >
          <Save className="w-4 h-4" />
          <span>Simpan Pengaturan</span>
        </Button>
      </div>

      {isKostLoading ? (
        <div className="flex justify-center p-12"><Spinner /></div>
      ) : (
      <>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-row md:flex-col overflow-x-auto custom-scrollbar space-x-1 md:space-x-0 md:space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap text-sm font-bold ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-navy'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'umum' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-navy mb-4 border-b border-slate-100 pb-4">Informasi Kos</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nama Kos</label>
                  <Input 
                    value={kostData.nama} 
                    onChange={e => setKostData({...kostData, nama: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                  <textarea 
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-none"
                    value={kostData.alamat}
                    onChange={e => setKostData({...kostData, alamat: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nomor Telepon Pengelola</label>
                    <Input 
                      value={kostData.no_telepon} 
                      onChange={e => setKostData({...kostData, no_telepon: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Pengelola</label>
                    <Input 
                      value={kostData.email} 
                      type="email" 
                      onChange={e => setKostData({...kostData, email: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pembayaran' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-navy mb-4 border-b border-slate-100 pb-4">Pengaturan Penagihan</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal Jatuh Tempo (Default)</label>
                    <Input 
                      type="number" 
                      min="1" max="28" 
                      value={kostData.settings?.pembayaran_tanggal_jatuh_tempo}
                      onChange={e => setKostData({...kostData, settings: {...kostData.settings, pembayaran_tanggal_jatuh_tempo: parseInt(e.target.value)}})}
                    />
                    <p className="text-xs text-slate-500 mt-1">Tanggal tagihan otomatis dikirim setiap bulan.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Denda Keterlambatan (Rp)</label>
                    <Input 
                      type="text"
                      placeholder="50.000"
                      value={kostData.settings?.pembayaran_denda_keterlambatan ? formatRupiah(kostData.settings?.pembayaran_denda_keterlambatan) : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setKostData({ ...kostData, settings: { ...kostData.settings, pembayaran_denda_keterlambatan: val } });
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-1">Denda per hari keterlambatan.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-navy">Metode Pembayaran Tersimpan</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsBankModalOpen(true)}>
                        + Tambah Bank
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsQrisModalOpen(true)}>
                        + Tambah QRIS
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {isPaymentLoading ? (
                      <p className="text-sm text-slate-500">Memuat metode pembayaran...</p>
                    ) : paymentMethods?.length === 0 ? (
                      <p className="text-sm text-slate-500">Belum ada metode pembayaran yang terdaftar.</p>
                    ) : (
                      paymentMethods?.map((method: any) => (
                        <div key={method.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center font-bold text-xs ${method.tipe === 'QRIS' ? 'text-emerald-600' : 'text-blue-600'}`}>
                              {method.tipe}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-navy">{method.nama_provider}</p>
                              {method.tipe === 'QRIS' ? (
                                <p className="text-xs text-slate-500">{method.instruksi}</p>
                              ) : (
                                <p className="text-xs text-slate-500">{method.nomor_rekening} a/n {method.atas_nama}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-danger hover:bg-red-50"
                              onClick={() => {
                                if(confirm('Yakin ingin menghapus metode ini?')) deleteMutation.mutate(method.id);
                              }}
                              isLoading={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wifi' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-navy">Konfigurasi WiFi Kos</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={kostData.settings?.wifi_aktif}
                    onChange={e => setKostData({...kostData, settings: {...kostData.settings, wifi_aktif: e.target.checked}})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-slate-700">{kostData.settings?.wifi_aktif ? 'Aktif' : 'Nonaktif'}</span>
                </label>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 text-blue-800 flex gap-3 items-start">
                  <Wifi className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Informasi kredensial WiFi ini hanya akan ditampilkan pada Dashboard Penghuni yang memiliki kontrak sewa <strong>aktif</strong>.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Jaringan (SSID)</label>
                    <Input 
                      value={kostData.settings?.wifi_ssid}
                      onChange={e => setKostData({...kostData, settings: {...kostData.settings, wifi_ssid: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Kata Sandi (Password)</label>
                    <Input 
                      type="password" 
                      value={kostData.settings?.wifi_password}
                      onChange={e => setKostData({...kostData, settings: {...kostData.settings, wifi_password: e.target.value}})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Catatan / Instruksi</label>
                  <textarea 
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-none"
                    value={kostData.settings?.wifi_instruksi}
                    onChange={e => setKostData({...kostData, settings: {...kostData.settings, wifi_instruksi: e.target.value}})}
                  />
                  <p className="text-xs text-slate-500 mt-1">Catatan ini akan muncul di bawah informasi password WiFi penghuni.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifikasi' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-navy mb-4 border-b border-slate-100 pb-4">Pengaturan Peringatan</h3>
              <p className="text-sm text-slate-500 mb-4">Pilih kapan sistem harus mengirimkan notifikasi kepada Anda dan penghuni.</p>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                    checked={kostData.settings?.notifikasi_tagihan_baru}
                    onChange={e => setKostData({...kostData, settings: {...kostData.settings, notifikasi_tagihan_baru: e.target.checked}})}
                  />
                  <span className="text-sm font-medium text-slate-700">Tagihan baru dibuat</span>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                    checked={kostData.settings?.notifikasi_pembayaran_berhasil}
                    onChange={e => setKostData({...kostData, settings: {...kostData.settings, notifikasi_pembayaran_berhasil: e.target.checked}})}
                  />
                  <span className="text-sm font-medium text-slate-700">Pembayaran berhasil diterima</span>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                    checked={kostData.settings?.notifikasi_h3_jatuh_tempo}
                    onChange={e => setKostData({...kostData, settings: {...kostData.settings, notifikasi_h3_jatuh_tempo: e.target.checked}})}
                  />
                  <span className="text-sm font-medium text-slate-700">Pengingat H-3 Jatuh Tempo</span>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                    checked={kostData.settings?.notifikasi_kontrak_habis}
                    onChange={e => setKostData({...kostData, settings: {...kostData.settings, notifikasi_kontrak_habis: e.target.checked}})}
                  />
                  <span className="text-sm font-medium text-slate-700">Kontrak penghuni akan habis dalam 1 bulan</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'keamanan' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-navy mb-4 border-b border-slate-100 pb-4">Keamanan Aplikasi</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <h4 className="text-sm font-bold text-navy">Autentikasi Dua Faktor (2FA)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tingkatkan keamanan login akun Owner.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setKostData({...kostData, settings: {...kostData.settings, keamanan_2fa: !kostData.settings?.keamanan_2fa}})}
                  >
                    {kostData.settings?.keamanan_2fa ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <h4 className="text-sm font-bold text-navy">Sesi Perangkat</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Logout otomatis setelah {kostData.settings?.keamanan_sesi_hari} hari tidak aktif.</p>
                  </div>
                  <Input 
                    type="number"
                    className="w-24 text-center"
                    value={kostData.settings?.keamanan_sesi_hari}
                    onChange={e => setKostData({...kostData, settings: {...kostData.settings, keamanan_sesi_hari: parseInt(e.target.value)}})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} title="Tambah Rekening Bank">
        <form onSubmit={handleAddBank} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Nama Bank</label>
            <Input value={bankFormData.nama_provider} onChange={e => setBankFormData({...bankFormData, nama_provider: e.target.value})} placeholder="Contoh: BCA, BNI, Mandiri" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Nomor Rekening</label>
            <Input value={bankFormData.nomor_rekening} onChange={e => setBankFormData({...bankFormData, nomor_rekening: e.target.value})} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Atas Nama</label>
            <Input value={bankFormData.atas_nama} onChange={e => setBankFormData({...bankFormData, atas_nama: e.target.value})} required />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsBankModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Simpan Bank</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isQrisModalOpen} onClose={() => setIsQrisModalOpen(false)} title="Tambah QRIS">
        <form onSubmit={handleAddQris} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Nama / Label QRIS</label>
            <Input value={qrisFormData.nama_provider} onChange={e => setQrisFormData({...qrisFormData, nama_provider: e.target.value})} placeholder="Contoh: QRIS Toko Kostku" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Instruksi / Dukungan E-Wallet</label>
            <Input value={qrisFormData.instruksi} onChange={e => setQrisFormData({...qrisFormData, instruksi: e.target.value})} placeholder="Contoh: Mendukung Gopay, OVO, ShopeePay" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Upload Gambar Barcode QRIS</label>
            <Input type="file" accept="image/*" onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setQrisFile(e.target.files[0]);
              }
            }} required />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsQrisModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Simpan QRIS</Button>
          </div>
        </form>
      </Modal>
      </>
      )}
    </div>
  );
}
