import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

export function KamarList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['kamar'],
    queryFn: async () => {
      const res = await api.get('/kamar');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Kamar</h2>
          <p className="text-gray-500">Kelola daftar kamar, harga, dan status ketersediaan.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Kamar</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    Belum ada data kamar.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((kamar: any) => (
                  <TableRow key={kamar.id}>
                    <TableCell className="font-medium">{kamar.nomor_kamar}</TableCell>
                    <TableCell>{kamar.tipe}</TableCell>
                    <TableCell>Rp {Number(kamar.harga).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={kamar.status === 'Terisi' ? 'success' : 'danger'}>
                        {kamar.status}
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
