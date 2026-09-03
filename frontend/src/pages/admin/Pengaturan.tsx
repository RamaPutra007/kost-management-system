import React, { useState } from 'react';
import { Settings, Building2, Bell, CreditCard, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function Pengaturan() {
  const [activeTab, setActiveTab] = useState('umum');

  const tabs = [
    { id: 'umum', label: 'Umum', icon: <Building2 className="w-4 h-4" /> },
    { id: 'pembayaran', label: 'Pembayaran', icon: <CreditCard className="w-4 h-4" /> },
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
        <Button className="flex items-center space-x-2 w-full sm:w-auto">
          <Save className="w-4 h-4" />
          <span>Simpan Pengaturan</span>
        </Button>
      </div>

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
                  <Input defaultValue="KOSTKU Premiere" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                  <textarea 
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-none"
                    defaultValue="Jl. Sudirman No. 123, Jakarta Selatan"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nomor Telepon Pengelola</label>
                    <Input defaultValue="081234567890" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Pengelola</label>
                    <Input defaultValue="admin@kostku.com" type="email" />
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
                    <Input type="number" defaultValue="5" min="1" max="28" />
                    <p className="text-xs text-slate-500 mt-1">Tanggal tagihan otomatis dikirim setiap bulan.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Denda Keterlambatan (Rp)</label>
                    <Input type="number" defaultValue="50000" />
                    <p className="text-xs text-slate-500 mt-1">Denda per hari keterlambatan.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-navy mb-3">Integrasi Rekening Bank</h4>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center font-bold text-blue-600">
                        BCA
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy">Bank Central Asia</p>
                        <p className="text-xs text-slate-500">1234567890 a/n KOSTKU</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Ubah</Button>
                  </div>
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
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                  <span className="text-sm font-medium text-slate-700">Tagihan baru dibuat</span>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                  <span className="text-sm font-medium text-slate-700">Pembayaran berhasil diterima</span>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                  <span className="text-sm font-medium text-slate-700">Pengingat H-3 Jatuh Tempo</span>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
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
                  <Button variant="outline" size="sm">Aktifkan</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <h4 className="text-sm font-bold text-navy">Sesi Perangkat</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Logout otomatis setelah 30 hari tidak aktif.</p>
                  </div>
                  <Button variant="outline" size="sm">Ubah Aturan</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
