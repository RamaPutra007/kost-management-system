import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/utils';

const data = [
  { name: 'Jan', Pendapatan: 4000, Pengeluaran: 2400 },
  { name: 'Feb', Pendapatan: 3000, Pengeluaran: 1398 },
  { name: 'Mar', Pendapatan: 2000, Pengeluaran: 9800 },
  { name: 'Apr', Pendapatan: 2780, Pengeluaran: 3908 },
  { name: 'Mei', Pendapatan: 1890, Pengeluaran: 4800 },
  { name: 'Jun', Pendapatan: 2390, Pengeluaran: 3800 },
  { name: 'Jul', Pendapatan: 3490, Pengeluaran: 4300 },
];

export function Laporan() {
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
                  ${data.map(e => `
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
            <h3 className="font-bold text-slate-500">Total Pendapatan</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy print:text-xl">Rp 19.550.000</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="success">+12%</Badge>
            <span className="text-sm text-slate-400 font-medium">vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-6 print:p-2 rounded-2xl border border-slate-200 print:border-0 shadow-sm print:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Total Pengeluaran</h3>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy print:text-xl">Rp 3.400.000</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="danger">+5%</Badge>
            <span className="text-sm text-slate-400 font-medium">vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-6 print:p-2 rounded-2xl border border-slate-200 print:border-0 shadow-sm print:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-500">Laba Bersih</h3>
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy print:text-xl">Rp 16.150.000</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="info">+15%</Badge>
            <span className="text-sm text-slate-400 font-medium">vs bulan lalu</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 print:p-0 rounded-2xl border border-slate-200 print:border-0 shadow-sm print:shadow-none mb-8">
        <h3 className="text-lg font-bold text-navy mb-6">Arus Kas (6 Bulan Terakhir)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} dx={-10} />
              <RechartsTooltip 
                cursor={{fill: '#F1F5F9'}} 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              <Bar dataKey="Pendapatan" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Pengeluaran" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
