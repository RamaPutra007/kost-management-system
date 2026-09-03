import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { api } from '@/lib/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await api.post('/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Terlalu banyak percobaan. Silakan tunggu beberapa saat.');
      } else {
        setError(
          err.response?.data?.message ||
          'Gagal mengirim link reset password.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-primary/30 relative overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-navy tracking-tight">KOSTKU</span>
          </Link>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-4 sm:px-10 shadow-2xl border border-slate-100 rounded-3xl">

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-navy mb-2">Lupa Password?</h2>
            <p className="text-slate-500 font-medium text-sm">
              Masukkan email yang terdaftar, kami akan mengirimkan instruksi untuk mengatur ulang password Anda.
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            </Alert>
          )}

          {success ? (
            <div className="text-center animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">Email Terkirim!</h3>
              <p className="text-slate-500 mb-8 text-sm">
                Silakan periksa kotak masuk email Anda (termasuk folder spam) untuk link reset password.
              </p>
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => navigate('/login')}
              >
                Kembali ke Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-navy">Email Address</label>
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                  autoComplete="email"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-base shadow-lg shadow-primary/25"
                isLoading={isLoading}
              >
                Kirim Link Reset
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-navy transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
