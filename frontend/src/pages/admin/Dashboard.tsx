import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Home, Users, Wallet, CreditCard, PieChart } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const res = await api.get('/dashboard/overview');
      return res.data.overview;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-700">
        Failed to load dashboard data.
      </div>
    );
  }

  const stats = [
    { name: 'Kamar Terisi', value: data.kamar_terisi, total: data.total_kamar, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Kamar Kosong', value: data.kamar_kosong, total: data.total_kamar, icon: Home, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Total Penghuni', value: data.total_penghuni, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Pendapatan Bulan Ini', value: `Rp ${data.pendapatan_bulan_ini.toLocaleString()}`, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Pengeluaran Bulan Ini', value: `Rp ${data.pengeluaran_bulan_ini.toLocaleString()}`, icon: PieChart, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Laba Bersih', value: `Rp ${data.laba_bersih.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  {stat.total !== undefined && (
                    <span className="text-sm font-medium text-gray-500">/ {stat.total}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
