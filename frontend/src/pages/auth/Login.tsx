import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';

import { api } from '@/lib/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Terlalu banyak percobaan login. Silakan tunggu sebentar.');
      } else {
        setError(err.response?.data?.message || 'Email atau password salah.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-primary/30 overflow-hidden">
      
      {/* Left Panel - Branding/Illustration (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-7/12 bg-navy relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 mb-16 inline-flex">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">KOSTKU</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-lg mb-6">
            Kelola kost dengan lebih mudah.
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            Satu platform cerdas untuk otomatisasi tagihan, kontrak, dan pelaporan keuangan kost Anda.
          </p>
        </div>

        {/* Abstract Dashboard Mockup */}
        <div className="relative z-10 w-[120%] h-64 bg-slate-900 rounded-t-3xl border-t border-l border-slate-700/50 p-6 shadow-2xl mt-12 flex space-x-6 rotate-2 transform-origin-bottom-right opacity-90 translate-y-12">
          <div className="w-48 bg-slate-800 rounded-2xl p-4 space-y-4">
             <div className="w-full h-8 bg-slate-700 rounded-lg"></div>
             <div className="w-3/4 h-8 bg-slate-700 rounded-lg"></div>
             <div className="w-full h-8 bg-slate-700 rounded-lg"></div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex justify-between">
               <div className="w-32 h-10 bg-slate-800 rounded-lg"></div>
               <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="h-24 bg-primary/20 rounded-xl border border-primary/30"></div>
               <div className="h-24 bg-slate-800 rounded-xl"></div>
               <div className="h-24 bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-white relative z-10 shadow-2xl">
        <div className="w-full max-w-md mx-auto">
          
          <div className="md:hidden flex items-center space-x-2.5 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-navy tracking-tight">KOSTKU</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-navy mb-2">Selamat Datang Kembali</h2>
            <p className="text-slate-500 font-medium">Masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-navy">Email Address</label>
              <Input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-navy">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-navy transition-colors focus:outline-none rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Checkbox
                id="remember"
                label="Ingat Saya"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Link 
                to="/forgot-password" 
                className="text-sm font-bold text-primary hover:text-blue-700 transition-colors"
              >
                Lupa Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 h-12 text-base shadow-lg shadow-primary/25"
              isLoading={isLoading}
            >
              Masuk
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
