import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';

export function PembayaranList() {
  const queryClient = useQueryClient();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [statusVerifikasi, setStatusVerifikasi] = useState('Pending');

  const { data, isLoading, error } = useQuery({
    queryKey: ['pembayaran'],
    queryFn: async () => {
      const res = await api.get('/pembayaran');
      return res.data.data || res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status_verifikasi }: { id: number, status_verifikasi: string }) => {
      return await api.put(`/pembayaran/${id}`, { status_verifikasi });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pembayaran'] });
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
      toast.success('Status pembayaran berhasil diubah');
      setIsStatusModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateStatusMutation.mutate({ id: selectedItem.id, status_verifikasi: statusVerifikasi });
    }
  };

  const openStatusModal = (pembayaran: any) => {
    setSelectedItem(pembayaran);
    setStatusVerifikasi(pembayaran.status_verifikasi);
    setIsStatusModalOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pembayaran</h2>
          <p className="text-gray-500">Verifikasi pembayaran dari penghuni kost.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Belum ada data pembayaran.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.tanggal_bayar}</TableCell>
                    <TableCell>{item.penghuni?.user?.name}</TableCell>
                    <TableCell>Rp {Number(item.nominal_bayar).toLocaleString()}</TableCell>
                    <TableCell>{item.metode_pembayaran}</TableCell>
                    <TableCell>
                      <Badge variant={item.status_verifikasi === 'Valid' ? 'success' : item.status_verifikasi === 'Invalid' ? 'danger' : 'warning'}>
                        {item.status_verifikasi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openStatusModal(item)}>Verifikasi</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Ubah Status */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Verifikasi Pembayaran"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status Verifikasi</label>
            <Select
              value={statusVerifikasi}
              onChange={(e) => setStatusVerifikasi(e.target.value)}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Valid">Valid (Lunas)</option>
              <option value="Invalid">Invalid (Ditolak)</option>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Mengubah ke Valid akan otomatis merubah status Tagihan menjadi Lunas.</p>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsStatusModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={updateStatusMutation.isPending}>Simpan Perubahan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
