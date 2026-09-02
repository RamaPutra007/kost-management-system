import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';

export function KamarList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    kost_id: '',
    nomor_kamar: '',
    tipe: '',
    harga: '',
    fasilitas: '',
    status: 'Kosong',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['kamar'],
    queryFn: async () => {
      const res = await api.get('/kamar');
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

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingId) {
        return await api.put(`/kamar/${editingId}`, data);
      } else {
        return await api.post('/kamar', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kamar'] });
      toast.success(editingId ? 'Kamar berhasil diubah' : 'Kamar berhasil ditambahkan');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/kamar/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kamar'] });
      toast.success('Kamar berhasil dihapus');
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

  const handleEdit = (kamar: any) => {
    setEditingId(kamar.id);
    setFormData({
      kost_id: kamar.kost_id,
      nomor_kamar: kamar.nomor_kamar,
      tipe: kamar.tipe,
      harga: kamar.harga,
      fasilitas: kamar.fasilitas || '',
      status: kamar.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (kamar: any) => {
    setSelectedItem(kamar);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      kost_id: kosts?.[0]?.id || '',
      nomor_kamar: '',
      tipe: '',
      harga: '',
      fasilitas: '',
      status: 'Kosong',
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
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Kamar</h2>
          <p className="text-gray-500">Kelola daftar kamar, harga, dan status ketersediaan.</p>
        </div>
        <Button onClick={openAddModal}>Tambah Kamar</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Kamar</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
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
                      <Badge variant={kamar.status === 'Terisi' ? 'success' : kamar.status === 'Kosong' ? 'default' : 'warning'}>
                        {kamar.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(kamar)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(kamar)}>Hapus</Button>
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
        title={editingId ? 'Edit Kamar' : 'Tambah Kamar'}
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
            <label className="text-sm font-medium">Nomor Kamar</label>
            <Input
              value={formData.nomor_kamar}
              onChange={(e) => setFormData({ ...formData, nomor_kamar: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipe</label>
            <Input
              value={formData.tipe}
              onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Harga</label>
            <Input
              type="number"
              value={formData.harga}
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Kosong">Kosong</option>
              <option value="Terisi">Terisi</option>
              <option value="Perbaikan">Perbaikan</option>
            </Select>
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
            Apakah Anda yakin ingin menghapus kamar <strong>{selectedItem?.nomor_kamar}</strong>?
            Tindakan ini tidak dapat dibatalkan.
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
