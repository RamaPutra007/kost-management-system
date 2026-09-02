import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/login', { email, password });
      login(res.data.access_token, res.data.user);
      
      if (res.data.user.role.name === 'Penghuni') {
        navigate('/my-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Silakan periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900 selection:bg-blue-200">
      
      {/* LEFT SIDE - BRANDING & ILLUSTRATION (HIDDEN ON MOBILE) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Top Header */}
        <div className="relative z-10 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            KostMaster
          </span>
        </div>

        {/* Central Illustration / Mockup */}
        <div className="relative z-10 mt-12">
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Kelola Bisnis Kost <br />
            Tanpa Batas Ruang & Waktu.
          </h2>
          <p className="text-slate-400 text-lg max-w-md mb-12 leading-relaxed">
            Sistem manajemen properti all-in-one yang menyederhanakan penagihan, kontrak, dan operasional Anda setiap hari.
          </p>
          
          {/* Abstract Dashboard Card Mockup */}
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl transform rotate-3 scale-105"></div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-900 rounded-full">Owner Dashboard</div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-slate-700 rounded-md"></div>
                <div className="flex space-x-4">
                  <div className="h-20 flex-1 bg-gradient-to-br from-blue-900/50 to-blue-800/20 rounded-xl border border-blue-800/30 p-3">
                    <div className="h-3 w-1/2 bg-blue-400/40 rounded mb-2"></div>
                    <div className="h-6 w-3/4 bg-blue-400/60 rounded"></div>
                  </div>
                  <div className="h-20 flex-1 bg-gradient-to-br from-emerald-900/50 to-emerald-800/20 rounded-xl border border-emerald-800/30 p-3">
                    <div className="h-3 w-1/2 bg-emerald-400/40 rounded mb-2"></div>
                    <div className="h-6 w-3/4 bg-emerald-400/60 rounded"></div>
                  </div>
                </div>
                <div className="h-16 w-full bg-slate-700/50 rounded-xl border border-slate-700/50 flex items-center px-4 justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                     </div>
                     <div className="space-y-1.5">
                       <div className="h-2.5 w-24 bg-slate-500 rounded"></div>
                       <div className="h-2 w-16 bg-slate-600 rounded"></div>
                     </div>
                   </div>
                   <div className="h-4 w-20 bg-slate-600 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Floating Shield */}
            <div className="absolute -right-6 -bottom-6 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl flex items-center space-x-3 animate-bounce hover:pause">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">100% Aman</p>
                <p className="text-slate-400 text-xs">Sistem Terenkripsi</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Credits */}
        <div className="relative z-10 text-slate-500 text-sm">
          &copy; 2026 Kost Management System. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden items-center justify-center space-x-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
               <Building2 className="w-6 h-6 text-white" />
             </div>
             <span className="text-2xl font-bold text-slate-900 tracking-tight">
               KostMaster
             </span>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-slate-500 text-base">
              Masukkan kredensial Anda untuk mengakses dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-red-800">Gagal Masuk</h3>
                  <p className="text-sm text-red-600 mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <Input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-4 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2.5 relative">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-4 pr-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all bg-slate-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                  Ingat Saya
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Lupa Password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
              isLoading={loading}
            >
              Masuk Sekarang
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>
          
          <p className="text-center text-sm text-slate-500">
            Kendala akses? <a href="#" className="font-semibold text-slate-900 hover:underline">Hubungi Tim IT</a>
          </p>

        </div>
      </div>
    </div>
  );
}
