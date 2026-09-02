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

export function KontrakList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    kamar_id: '',
    penghuni_id: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    harga_kesepakatan: '',
    deposit: '',
  });

  const [statusData, setStatusData] = useState('Aktif');

  const { data, isLoading, error } = useQuery({
    queryKey: ['kontrak_sewa'],
    queryFn: async () => {
      const res = await api.get('/kontrak_sewa');
      return res.data.data || res.data;
    }
  });

  const { data: kamars } = useQuery({
    queryKey: ['kamar'],
    queryFn: async () => {
      const res = await api.get('/kamar');
      return (res.data.data || res.data).filter((k: any) => k.status === 'Kosong');
    }
  });

  const { data: penghunis } = useQuery({
    queryKey: ['penghuni'],
    queryFn: async () => {
      const res = await api.get('/penghuni');
      return res.data.data || res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/kontrak_sewa', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontrak_sewa'] });
      queryClient.invalidateQueries({ queryKey: ['kamar'] });
      toast.success('Kontrak berhasil dibuat');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return await api.put(`/kontrak_sewa/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontrak_sewa'] });
      queryClient.invalidateQueries({ queryKey: ['kamar'] });
      toast.success('Status kontrak berhasil diubah');
      setIsStatusModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateStatusMutation.mutate({ id: selectedItem.id, status: statusData });
    }
  };

  const openStatusModal = (kontrak: any) => {
    setSelectedItem(kontrak);
    setStatusData(kontrak.status);
    setIsStatusModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      kamar_id: kamars?.[0]?.id || '',
      penghuni_id: penghunis?.[0]?.id || '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      harga_kesepakatan: '',
      deposit: '',
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
          <h2 className="text-2xl font-bold tracking-tight">Kontrak Sewa</h2>
          <p className="text-gray-500">Kelola penyewaan kamar oleh penghuni.</p>
        </div>
        <Button onClick={openAddModal}>Buat Kontrak Baru</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kamar</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Belum ada data kontrak.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.kamar?.nomor_kamar}</TableCell>
                    <TableCell>{item.penghuni?.user?.name}</TableCell>
                    <TableCell>
                      {item.tanggal_mulai} s/d {item.tanggal_selesai}
                    </TableCell>
                    <TableCell>Rp {Number(item.harga_kesepakatan).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Aktif' ? 'success' : item.status === 'Selesai' ? 'default' : 'danger'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openStatusModal(item)}>Ubah Status</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Kontrak Sewa Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kamar (Hanya yang kosong)</label>
            <Select
              value={formData.kamar_id}
              onChange={(e) => setFormData({ ...formData, kamar_id: e.target.value })}
              required
            >
              <option value="">Pilih Kamar...</option>
              {kamars?.map((k: any) => (
                <option key={k.id} value={k.id}>{k.nomor_kamar} - Rp {k.harga}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Penghuni</label>
            <Select
              value={formData.penghuni_id}
              onChange={(e) => setFormData({ ...formData, penghuni_id: e.target.value })}
              required
            >
              <option value="">Pilih Penghuni...</option>
              {penghunis?.map((p: any) => (
                <option key={p.id} value={p.id}>{p.user?.name} ({p.nik})</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Input
                type="date"
                value={formData.tanggal_mulai}
                onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Selesai</label>
              <Input
                type="date"
                value={formData.tanggal_selesai}
                onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Harga Kesepakatan</label>
            <Input
              type="number"
              value={formData.harga_kesepakatan}
              onChange={(e) => setFormData({ ...formData, harga_kesepakatan: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deposit (Opsional)</label>
            <Input
              type="number"
              value={formData.deposit}
              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Simpan Kontrak</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Ubah Status */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Ubah Status Kontrak"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status Kontrak</label>
            <Select
              value={statusData}
              onChange={(e) => setStatusData(e.target.value)}
              required
            >
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
            </Select>
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
