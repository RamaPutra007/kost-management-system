import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Home } from 'lucide-react';

export function MyRoom() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my_kontrak'],
    queryFn: async () => {
      const res = await api.get('/kontrak_sewa');
      return res.data.data || res.data;
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  const activeKontrak = data?.find((k: any) => k.status === 'Aktif');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kamar Saya</h2>
          <p className="text-gray-500">Informasi detail mengenai kamar yang Anda sewa.</p>
        </div>
      </div>

      {activeKontrak ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Kamar {activeKontrak.kamar?.nomor_kamar}</span>
              <Badge variant="success" className="ml-2">Aktif</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tipe Kamar</p>
                <p className="font-medium">{activeKontrak.kamar?.tipe}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Harga Sewa Bulanan</p>
                <p className="font-medium">Rp {Number(activeKontrak.harga_kesepakatan).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Periode Mulai</p>
                <p className="font-medium">{activeKontrak.tanggal_mulai}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Periode Selesai</p>
                <p className="font-medium">{activeKontrak.tanggal_selesai}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Fasilitas Kamar</p>
                <p className="font-medium">
                  {Array.isArray(activeKontrak.kamar?.fasilitas) 
                    ? (activeKontrak.kamar.fasilitas.map((f: any) => f.nama_fasilitas).join(', ') || '-') 
                    : (activeKontrak.kamar?.fasilitas || '-')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Anda belum memiliki kamar aktif saat ini.
          </CardContent>
        </Card>
      )}

      {data?.length > 1 && (
        <div className="pt-8">
          <h3 className="text-lg font-bold tracking-tight mb-4">Riwayat Sewa</h3>
          <div className="space-y-4">
            {data.filter((k: any) => k.status !== 'Aktif').map((k: any) => (
              <Card key={k.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Kamar {k.kamar?.nomor_kamar}</p>
                    <p className="text-sm text-gray-500">{k.tanggal_mulai} s/d {k.tanggal_selesai}</p>
                  </div>
                  <Badge variant={k.status === 'Selesai' ? 'default' : 'danger'}>{k.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
