import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';
import { showAlert } from '@/lib/utils';
import { Megaphone, Plus, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function PengumumanList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const { data: pengumuman, isLoading, error } = useQuery({
    queryKey: ['pengumuman'],
    queryFn: async () => {
      const res = await api.get('/pengumuman');
      return res.data.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (submitData: any) => {
      return await api.post('/pengumuman', submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
      showAlert.success('Pengumuman berhasil dibuat dan disinkronkan ke penghuni');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Terjadi kesalahan saat membuat pengumuman');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/pengumuman/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
      showAlert.success('Pengumuman berhasil dihapus dari riwayat');
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info'
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data pengumuman.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Pengumuman</h2>
          <p className="text-slate-500 text-sm mt-1">Buat pemberitahuan masal ke seluruh penghuni kos.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Buat Pengumuman
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <h3 className="text-sm font-bold text-navy flex items-center">
            <Megaphone className="w-4 h-4 mr-2 text-primary" /> Riwayat Pengumuman
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-navy">Judul</TableHead>
                <TableHead className="font-bold text-navy">Tipe</TableHead>
                <TableHead className="font-bold text-navy">Pesan</TableHead>
                <TableHead className="font-bold text-navy">Waktu</TableHead>
                <TableHead className="font-bold text-navy">Dibuat Oleh</TableHead>
                <TableHead className="text-right font-bold text-navy">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!pengumuman || pengumuman.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Megaphone className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-slate-500">Belum ada riwayat pengumuman.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pengumuman.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-bold text-navy">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant={item.type === 'danger' ? 'danger' : item.type === 'warning' ? 'warning' : item.type === 'success' ? 'success' : 'info'}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-slate-600">
                      {item.message}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-600">
                      {item.creator?.name || 'Sistem'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)} className="text-danger hover:bg-red-50 w-8 h-8 p-0" title="Hapus dari riwayat">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
        title="Buat Pengumuman Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Judul Pengumuman</label>
            <Input
              placeholder="Contoh: Pemadaman Listrik Sementara"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Tipe / Kategori</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="info">Informasi (Biru)</option>
              <option value="warning">Peringatan (Kuning)</option>
              <option value="success">Sukses (Hijau)</option>
              <option value="danger">Penting / Darurat (Merah)</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Pesan</label>
            <textarea
              className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200"
              placeholder="Tulis pesan pengumuman..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending} className="shadow-md">
              Kirim ke Semua Penghuni
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Riwayat Pengumuman"
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              Apakah Anda yakin ingin menghapus riwayat pengumuman <strong className="font-black text-danger">{selectedItem?.title}</strong>?
              <br/><br/>
              Catatan: Menghapus ini hanya akan menghapus dari riwayat Admin, tapi tidak menarik kembali notifikasi yang sudah masuk ke akun Penghuni.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
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
