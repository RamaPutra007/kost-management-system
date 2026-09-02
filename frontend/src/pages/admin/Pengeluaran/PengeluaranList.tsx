import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';

export function PengeluaranList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    kost_id: '',
    kategori_id: '',
    tanggal: '',
    nominal: '',
    keterangan: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['pengeluaran'],
    queryFn: async () => {
      const res = await api.get('/pengeluaran');
      return res.data.data || res.data;
    }
  });

  const { data: kosts } = useQuery({
    queryKey: ['kost'],
    queryFn: async () => {
      const res = await api.get('/kost');
      return res.data.data || res.data;
    }
  });

  const { data: kategori } = useQuery({
    queryKey: ['kategori_pengeluaran'],
    queryFn: async () => {
      const res = await api.get('/kategori_pengeluaran');
      return res.data.data || res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingId) {
        return await api.put(`/pengeluaran/${editingId}`, data);
      } else {
        return await api.post('/pengeluaran', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      toast.success(editingId ? 'Pengeluaran berhasil diubah' : 'Pengeluaran berhasil ditambahkan');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/pengeluaran/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      toast.success('Pengeluaran berhasil dihapus');
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleEdit = (pengeluaran: any) => {
    setEditingId(pengeluaran.id);
    setFormData({
      kost_id: pengeluaran.kost_id,
      kategori_id: pengeluaran.kategori_id,
      tanggal: pengeluaran.tanggal,
      nominal: pengeluaran.nominal,
      keterangan: pengeluaran.keterangan || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (pengeluaran: any) => {
    setSelectedItem(pengeluaran);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      kost_id: kosts?.[0]?.id || '',
      kategori_id: kategori?.[0]?.id || '',
      tanggal: '',
      nominal: '',
      keterangan: '',
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengeluaran</h2>
          <p className="text-gray-500">Pencatatan pengeluaran operasional kost.</p>
        </div>
        <Button onClick={openAddModal}>Tambah Pengeluaran</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Dicatat Oleh</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Belum ada data pengeluaran.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.tanggal}</TableCell>
                    <TableCell>{item.kategori?.nama}</TableCell>
                    <TableCell>{item.keterangan || '-'}</TableCell>
                    <TableCell>Rp {Number(item.nominal).toLocaleString()}</TableCell>
                    <TableCell>{item.pencatat?.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(item)}>Hapus</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kost</label>
            <Select
              value={formData.kost_id}
              onChange={(e) => setFormData({ ...formData, kost_id: e.target.value })}
              required
            >
              <option value="">Pilih Kost...</option>
              {kosts?.map((k: any) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Kategori</label>
            <Select
              value={formData.kategori_id}
              onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
              required
            >
              <option value="">Pilih Kategori...</option>
              {kategori?.map((k: any) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal</label>
            <Input
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nominal (Rp)</label>
            <Input
              type="number"
              value={formData.nominal}
              onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Keterangan</label>
            <Input
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending}>Simpan</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus data pengeluaran ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
