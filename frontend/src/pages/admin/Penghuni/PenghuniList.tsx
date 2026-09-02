import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export function PenghuniList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['penghuni'],
    queryFn: async () => {
      const res = await api.get('/penghuni');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Penghuni</h2>
          <p className="text-gray-500">Kelola data penghuni kost.</p>
        </div>
        <Button>Tambah Penghuni</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Pekerjaan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    Belum ada data penghuni.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.user?.name || '-'}</TableCell>
                    <TableCell>{item.nomor_hp}</TableCell>
                    <TableCell>{item.pekerjaan}</TableCell>
                    <TableCell>
                      <Badge variant={item.status_aktif ? 'success' : 'danger'}>
                        {item.status_aktif ? 'Aktif' : 'Tidak Aktif'}
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
