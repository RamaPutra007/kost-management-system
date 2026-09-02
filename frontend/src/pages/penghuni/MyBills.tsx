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

export function MyBills() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<any>(null);

  const [formData, setFormData] = useState({
    tagihan_id: '',
    nominal_bayar: '',
    metode_pembayaran: 'Transfer Bank',
    tanggal_bayar: new Date().toISOString().split('T')[0],
    bukti_pembayaran: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['my_tagihan'],
    queryFn: async () => {
      const res = await api.get('/tagihan');
      return res.data.data || res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/pembayaran', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_tagihan'] });
      queryClient.invalidateQueries({ queryKey: ['my_pembayaran'] });
      toast.success('Pembayaran berhasil disubmit dan menunggu verifikasi.');
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat memproses pembayaran.');
    }
  });

  const handlePay = (tagihan: any) => {
    setSelectedTagihan(tagihan);
    setFormData({
      tagihan_id: tagihan.id,
      nominal_bayar: tagihan.total_tagihan,
      metode_pembayaran: 'Transfer Bank',
      tanggal_bayar: new Date().toISOString().split('T')[0],
      bukti_pembayaran: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tagihan Saya</h2>
          <p className="text-gray-500">Lihat dan bayar tagihan Anda.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bulan</TableHead>
                <TableHead>Kamar</TableHead>
                <TableHead>Total Tagihan</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Belum ada data tagihan.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.bulan_tagihan}</TableCell>
                    <TableCell>{item.kontrak_sewa?.kamar?.nomor_kamar || '-'}</TableCell>
                    <TableCell>Rp {Number(item.total_tagihan).toLocaleString()}</TableCell>
                    <TableCell>{item.jatuh_tempo}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Lunas' ? 'success' : item.status === 'Belum Lunas' ? 'danger' : 'warning'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status !== 'Lunas' ? (
                        <Button size="sm" onClick={() => handlePay(item)}>Bayar</Button>
                      ) : (
                        <span className="text-sm text-gray-500">Lunas</span>
                      )}
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
        title="Form Pembayaran"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bulan Tagihan</label>
            <Input value={selectedTagihan?.bulan_tagihan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nominal Bayar (Rp)</label>
            <Input
              type="number"
              value={formData.nominal_bayar}
              onChange={(e) => setFormData({ ...formData, nominal_bayar: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal Bayar</label>
            <Input
              type="date"
              value={formData.tanggal_bayar}
              onChange={(e) => setFormData({ ...formData, tanggal_bayar: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Metode Pembayaran</label>
            <Select
              value={formData.metode_pembayaran}
              onChange={(e) => setFormData({ ...formData, metode_pembayaran: e.target.value })}
              required
            >
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Tunai">Tunai</option>
              <option value="E-Wallet">E-Wallet</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bukti Pembayaran (URL Gambar)</label>
            <Input
              value={formData.bukti_pembayaran}
              onChange={(e) => setFormData({ ...formData, bukti_pembayaran: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending}>Submit Pembayaran</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
