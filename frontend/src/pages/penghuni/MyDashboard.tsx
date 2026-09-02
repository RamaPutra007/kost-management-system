import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Wallet, Home, FileText } from 'lucide-react';

export function MyDashboard() {
  const { data: tagihan, isLoading: loadingTagihan } = useQuery({
    queryKey: ['my_tagihan'],
    queryFn: async () => {
      const res = await api.get('/tagihan');
      return res.data.data || res.data;
    }
  });

  const { data: kontrak, isLoading: loadingKontrak } = useQuery({
    queryKey: ['my_kontrak'],
    queryFn: async () => {
      const res = await api.get('/kontrak_sewa');
      return res.data.data || res.data;
    }
  });

  if (loadingTagihan || loadingKontrak) return <div className="flex justify-center p-8"><Spinner /></div>;

  const unpaidTagihan = tagihan?.filter((t: any) => t.status === 'Belum Lunas') || [];
  const totalUnpaid = unpaidTagihan.reduce((sum: number, t: any) => sum + Number(t.total_tagihan), 0);
  const activeKontrak = kontrak?.find((k: any) => k.status === 'Aktif');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Selamat Datang!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tagihan Belum Dibayar</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {totalUnpaid.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">{unpaidTagihan.length} tagihan tertunda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kamar Anda</CardTitle>
            <Home className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeKontrak ? activeKontrak.kamar?.nomor_kamar : 'Belum Ada'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Status: {activeKontrak ? 'Aktif' : 'Tidak Aktif'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sewa Bulanan</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {activeKontrak ? Number(activeKontrak.harga_kesepakatan).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Berdasarkan kontrak aktif</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
