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

export function TagihanList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    penghuni_id: '',
    kontrak_sewa_id: '',
    bulan_tagihan: '',
    nominal: '',
    denda: '0',
    jatuh_tempo: '',
    status: 'Belum Lunas',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['tagihan'],
    queryFn: async () => {
      const res = await api.get('/tagihan');
      return res.data.data || res.data;
    }
  });

  const { data: kontrak } = useQuery({
    queryKey: ['kontrak_sewa_aktif'],
    queryFn: async () => {
      const res = await api.get('/kontrak_sewa');
      return (res.data.data || res.data).filter((k: any) => k.status === 'Aktif');
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/tagihan', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
      toast.success('Tagihan berhasil dibuat');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleKontrakChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const kId = e.target.value;
    const selected = kontrak?.find((k: any) => k.id.toString() === kId);
    if (selected) {
      setFormData({
        ...formData,
        kontrak_sewa_id: kId,
        penghuni_id: selected.penghuni_id,
        nominal: selected.harga_kesepakatan,
      });
    } else {
      setFormData({ ...formData, kontrak_sewa_id: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      penghuni_id: '',
      kontrak_sewa_id: '',
      bulan_tagihan: '',
      nominal: '',
      denda: '0',
      jatuh_tempo: '',
      status: 'Belum Lunas',
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
          <h2 className="text-2xl font-bold tracking-tight">Tagihan</h2>
          <p className="text-gray-500">Kelola tagihan bulanan penghuni kost.</p>
        </div>
        <Button onClick={openAddModal}>Buat Tagihan Baru</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bulan</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Total Tagihan</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    Belum ada data tagihan.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.bulan_tagihan}</TableCell>
                    <TableCell>{item.penghuni?.user?.name}</TableCell>
                    <TableCell>Rp {Number(item.total_tagihan).toLocaleString()}</TableCell>
                    <TableCell>{item.jatuh_tempo}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Lunas' ? 'success' : item.status === 'Belum Lunas' ? 'danger' : 'warning'}>
                        {item.status}
                      </Badge>
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
        title="Buat Tagihan Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kontrak Sewa Aktif</label>
            <Select
              value={formData.kontrak_sewa_id}
              onChange={handleKontrakChange}
              required
            >
              <option value="">Pilih Kontrak...</option>
              {kontrak?.map((k: any) => (
                <option key={k.id} value={k.id}>
                  {k.penghuni?.user?.name} - {k.kamar?.nomor_kamar}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan Tagihan</label>
              <Input
                type="date"
                value={formData.bulan_tagihan}
                onChange={(e) => setFormData({ ...formData, bulan_tagihan: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jatuh Tempo</label>
              <Input
                type="date"
                value={formData.jatuh_tempo}
                onChange={(e) => setFormData({ ...formData, jatuh_tempo: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <label className="text-sm font-medium">Denda (Rp)</label>
              <Input
                type="number"
                value={formData.denda}
                onChange={(e) => setFormData({ ...formData, denda: e.target.value })}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Buat Tagihan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
