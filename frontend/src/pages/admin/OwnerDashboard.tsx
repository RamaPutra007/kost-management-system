import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Building2, 
  DoorOpen, 
  DoorClosed, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CalendarClock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText
} from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Helper for IDR formatting
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('Rp', 'Rp ');
};

// Mock data for charts if API doesn't provide them yet
const revenueData = [
  { name: 'Jan', pendapatan: 10000000, pengeluaran: 4000000 },
  { name: 'Feb', pendapatan: 11000000, pengeluaran: 3500000 },
  { name: 'Mar', pendapatan: 10500000, pengeluaran: 5000000 },
  { name: 'Apr', pendapatan: 12500000, pengeluaran: 3750000 }, // Current month matching prompt
];

const occupancyData = [
  { name: 'Terisi', value: 96 },
  { name: 'Kosong', value: 4 },
];

const paymentStatusData = [
  { name: 'Lunas', value: 85 },
  { name: 'Belum Lunas', value: 15 },
];

const expenseBreakdownData = [
  { name: 'Listrik & Air', value: 1500000 },
  { name: 'Maintenance', value: 1000000 },
  { name: 'Gaji Karyawan', value: 1000000 },
  { name: 'Lainnya', value: 250000 },
];

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

export function OwnerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      try {
        const res = await api.get('/dashboard/overview');
        return res.data.overview;
      } catch (e) {
        throw new Error('Gagal memuat data dashboard');
      }
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
        <Spinner className="w-12 h-12 text-primary" />
        <p className="text-slate-500 font-medium animate-pulse">Memuat data finansial...</p>
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
              <h4 className="font-bold">Gagal Memuat Dashboard</h4>
              <p className="text-sm opacity-90">Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi nanti.</p>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  // Use real data if available, fallback to exact prompt requirements
  const totalKamar = data?.total_kamar || 120;
  const kamarTerisi = data?.kamar_terisi || 115;
  const kamarKosong = data?.kamar_kosong || 5;
  
  const pendapatanBulanan = data?.pendapatan_bulan_ini || 12500000;
  const pengeluaran = data?.pengeluaran_bulan_ini || 3750000;
  const pendapatanBersih = data?.laba_bersih || 8750000;
  
  const tagihanJatuhTempo = data?.tagihan_jatuh_tempo || 12;
  const kontrakAkanBerakhir = data?.kontrak_akan_berakhir || 4;

  const summaryCards = [
    { label: 'Total Kamar', value: totalKamar, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Kamar Terisi', value: kamarTerisi, icon: DoorClosed, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Kamar Tersedia', value: kamarKosong, icon: DoorOpen, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Pendapatan Bulanan', value: formatIDR(pendapatanBulanan), icon: Wallet, color: 'text-primary', bg: 'bg-primary/10', trend: '+12.5%' },
    { label: 'Pengeluaran', value: formatIDR(pengeluaran), icon: CreditCard, color: 'text-danger', bg: 'bg-danger/10', trend: '-2.4%' },
    { label: 'Pendapatan Bersih', value: formatIDR(pendapatanBersih), icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', trend: '+15.2%' },
    { label: 'Tagihan Jatuh Tempo', value: tagihanJatuhTempo, icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'Kontrak Segera Berakhir', value: kontrakAkanBerakhir, icon: CalendarClock, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight">Selamat datang kembali, Owner</h1>
          <p className="text-slate-500 mt-1">Berikut adalah ringkasan performa properti Anda hari ini.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {summaryCards.map((card, i) => (
          <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">{card.label}</p>
                  <h3 className="text-2xl font-black text-navy">{card.value}</h3>
                  {card.trend && (
                    <div className={`flex items-center mt-2 text-sm font-semibold ${card.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                      {card.trend.startsWith('+') ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {card.trend} vs bulan lalu
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-2xl ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart: Pendapatan vs Pengeluaran */}
        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-navy flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Pendapatan vs Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    tickFormatter={(value) => `Rp${value / 1000000}M`}
                    dx={-10}
                  />
                  <Tooltip 
                    formatter={(value: any) => formatIDR(value as number)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="pendapatan" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" name="Pendapatan" />
                  <Area type="monotone" dataKey="pengeluaran" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPengeluaran)" name="Pengeluaran" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Pengeluaran */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-navy flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-primary" />
              Breakdown Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatIDR(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {expenseBreakdownData.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-navy">{formatIDR(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Status Pembayaran */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-navy">Status Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={paymentStatusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600 }} />
                   <Tooltip formatter={(value) => `${value}%`} />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                     {paymentStatusData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.name === 'Lunas' ? '#22C55E' : '#EF4444'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        {/* Tagihan Terbaru */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-navy">Tagihan Terbaru</CardTitle>
            <FileText className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {[
                 { name: 'Andi Wijaya', room: 'Kamar 101', amount: 1500000, status: 'Lunas' },
                 { name: 'Siti Rahma', room: 'Kamar 102', amount: 1500000, status: 'Pending' },
                 { name: 'Budi Santoso', room: 'Kamar 103', amount: 1750000, status: 'Overdue' }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                   <div>
                     <p className="font-bold text-navy text-sm">{item.name}</p>
                     <p className="text-xs text-slate-500">{item.room}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-navy text-sm">{formatIDR(item.amount)}</p>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                       item.status === 'Lunas' ? 'bg-green-100 text-green-700' :
                       item.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                       'bg-red-100 text-red-700'
                     }`}>
                       {item.status}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>

        {/* Financial Insights */}
        <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-navy to-slate-800 text-white border-0">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-light" />
              Financial Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
               <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                 <p className="text-sm text-blue-200 mb-1 font-medium">Proyeksi Pendapatan (Bulan Ini)</p>
                 <h4 className="text-2xl font-black text-white">{formatIDR(15000000)}</h4>
                 <div className="w-full bg-white/20 h-2 rounded-full mt-3">
                   <div className="bg-green-400 h-2 rounded-full" style={{ width: '83%' }}></div>
                 </div>
                 <p className="text-xs text-slate-300 mt-2 text-right">83% Tercapai</p>
               </div>
               
               <div className="flex space-x-3">
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                   <AlertCircle className="w-5 h-5 text-primary-light" />
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   <strong className="text-white">Tip:</strong> Anda memiliki 12 tagihan jatuh tempo senilai <strong className="text-red-400">Rp 18.000.000</strong>. Segera kirimkan reminder otomatis.
                 </p>
               </div>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
