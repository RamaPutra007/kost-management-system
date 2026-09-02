import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

export function MyPayments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my_pembayaran'],
    queryFn: async () => {
      const res = await api.get('/pembayaran');
      return res.data.data || res.data;
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Riwayat Pembayaran</h2>
          <p className="text-gray-500">Lihat status pembayaran Anda.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tagihan Bulan</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    Belum ada riwayat pembayaran.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.tanggal_bayar}</TableCell>
                    <TableCell>{item.tagihan?.bulan_tagihan}</TableCell>
                    <TableCell>Rp {Number(item.nominal_bayar).toLocaleString()}</TableCell>
                    <TableCell>{item.metode_pembayaran}</TableCell>
                    <TableCell>
                      <Badge variant={item.status_verifikasi === 'Valid' ? 'success' : item.status_verifikasi === 'Invalid' ? 'danger' : 'warning'}>
                        {item.status_verifikasi}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
