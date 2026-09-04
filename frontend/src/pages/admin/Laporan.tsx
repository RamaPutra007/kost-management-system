import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

export function Laporan() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      try {
        const res = await api.get('/dashboard/overview');
        return res.data.overview;
      } catch (e) {
        throw new Error('Gagal memuat data laporan');
      }
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
        <Spinner className="w-12 h-12 text-primary" />
        <p className="text-slate-500 font-medium animate-pulse">Memuat data laporan...</p>
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
              <h4 className="font-bold">Gagal Memuat Laporan</h4>
              <p className="text-sm opacity-90">Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi nanti.</p>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  const chartData = dashboardData?.chart_data?.map((d: any) => ({
    name: d.name,
    Pendapatan: d.pendapatan,
    Pengeluaran: d.pengeluaran,
  })) || [];

  const totalPendapatan = dashboardData?.pendapatan_bulan_ini || 0;
  const totalPengeluaran = dashboardData?.pengeluaran_bulan_ini || 0;
  const labaBersih = dashboardData?.laba_bersih || 0;

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="print:hidden">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Laporan Keuangan</h1>
          <p className="text-slate-500 mt-1">Ringkasan performa dan mutasi kas properti Anda.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center space-x-2 print:hidden" onClick={() => window.print()}>
            <Download className="w-4 h-4" />
            <span>Unduh PDF</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2 print:hidden border-green-200 text-green-700 hover:bg-green-50" onClick={() => {
            const tableHtml = `
              <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
              <head><meta charset="utf-8"></head><body>
                <table>
                  <tr><th colspan="4" style="font-size: 16px; text-align: left; font-weight: bold;">LAPORAN KEUANGAN KOSTKU</th></tr>
                  <tr><td colspan="4">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</td></tr>
                  <tr></tr>
                  <tr>
                    <th style="border: 1px solid black; background-color: #f1f5f9; text-align: left;">Bulan</th>
                    <th style="border: 1px solid black; background-color: #f1f5f9; text-align: right;">Pendapatan (Rp)</th>
                    <th style="border: 1px solid black; background-color: #f1f5f9; text-align: right;">Pengeluaran (Rp)</th>
                    <th style="border: 1px solid black; background-color: #f1f5f9; text-align: right;">Laba Bersih (Rp)</th>
                  </tr>
                  ${chartData.map((e: any) => `
                    <tr>
                      <td style="border: 1px solid black; text-align: left;">${e.name}</td>
                      <td style="border: 1px solid black; text-align: right;">${e.Pendapatan.toLocaleString('id-ID')}</td>
                      <td style="border: 1px solid black; text-align: right;">${e.Pengeluaran.toLocaleString('id-ID')}</td>
                      <td style="border: 1px solid black; text-align: right;">${(e.Pendapatan - e.Pengeluaran).toLocaleString('id-ID')}</td>
                    </tr>
                  `).join('')}
                </table>
              </body></html>
            `;
            const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "laporan_keuangan.xls");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
            <Download className="w-4 h-4" />
            <span>Unduh Excel</span>
          </Button>
        </div>
      </div>

      <style type="text/css">
        {`
          @media print {
            @page { margin: 1cm; size: landscape; }
            body { padding: 0; -webkit-print-color-adjust: exact; }
          }
        `}
      </style>

      {/* Print Only Header */}
      <div className="hidden print:flex flex-col items-center mb-8 border-b-2 border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-navy uppercase tracking-widest">KOSTKU</h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">LAPORAN KEUANGAN</h2>
        <p className="text-sm text-slate-500 mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 print:p-2 rounded-2xl border border-slate-200 print:border-0 shadow-sm print:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Pendapatan (Bulan Ini)</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy print:text-xl">{formatIDR(totalPendapatan)}</p>
        </div>

        <div className="bg-white p-6 print:p-2 rounded-2xl border border-slate-200 print:border-0 shadow-sm print:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Pengeluaran (Bulan Ini)</h3>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy print:text-xl">{formatIDR(totalPengeluaran)}</p>
        </div>

        <div className="bg-white p-6 print:p-2 rounded-2xl border border-slate-200 print:border-0 shadow-sm print:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Laba Bersih (Bulan Ini)</h3>
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy print:text-xl">{formatIDR(labaBersih)}</p>
        </div>
      </div>

      <div className="bg-white p-6 print:p-0 rounded-2xl border border-slate-200 print:border-0 shadow-sm print:shadow-none mb-8">
        <h3 className="text-lg font-bold text-navy mb-6">Arus Kas (6 Bulan Terakhir)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={8}
            >
              <defs>
                <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#FB7185" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13, fontWeight: 600}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13, fontWeight: 500}} dx={-10} 
                     tickFormatter={(value) => `Rp ${value >= 1000000 ? (value / 1000000) + 'jt' : value >= 1000 ? (value / 1000) + 'k' : value}`}
              />
              <RechartsTooltip 
                cursor={{fill: 'rgba(241, 245, 249, 0.4)'}} 
                contentStyle={{
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)'
                }}
                itemStyle={{fontWeight: 700, paddingTop: '4px'}}
                labelStyle={{color: '#64748B', fontWeight: 600, marginBottom: '4px'}}
                formatter={(value: any) => formatIDR(Number(value) || 0)}
              />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '24px', fontWeight: 600, fontSize: '14px', color: '#334155'}} />
              <Bar dataKey="Pendapatan" fill="url(#colorPendapatan)" radius={[8, 8, 0, 0]} maxBarSize={48} animationDuration={1500} />
              <Bar dataKey="Pengeluaran" fill="url(#colorPengeluaran)" radius={[8, 8, 0, 0]} maxBarSize={48} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
