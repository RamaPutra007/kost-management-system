import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

export function Profil() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '081234567890',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Profil Saya</h1>
        <p className="text-slate-500 mt-1">Kelola informasi pribadi dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <Avatar 
                size="lg" 
                fallback={user?.name?.charAt(0).toUpperCase()} 
                className="w-24 h-24 text-3xl bg-primary-light text-primary font-bold mx-auto"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors shadow-sm">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-navy">{user?.name || 'User'}</h2>
            <p className="text-sm font-medium text-slate-500 mb-4">{user?.role?.name || 'Role'}</p>
            <div className="inline-flex px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
              Akun Aktif
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Informasi Pribadi
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  leftIcon={<User className="w-4 h-4" />}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">No. Telepon</label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-primary" />
              Keamanan Akun
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
                <Input 
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
                  <Input 
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                  <Input 
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Perbarui Sandi</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
