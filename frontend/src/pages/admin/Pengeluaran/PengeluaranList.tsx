import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { toast } from 'react-hot-toast';
import { showAlert } from '@/lib/utils';
import { Search, Filter, Plus, Calendar, Edit2, Trash2, Receipt, AlertCircle } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export function PengeluaranList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Search, Filter, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    mutationFn: async (submitData: any) => {
      if (editingId) {
        return await api.put(`/pengeluaran/${editingId}`, submitData);
      } else {
        return await api.post('/pengeluaran', submitData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      showAlert.success(editingId ? 'Catatan pengeluaran berhasil diperbarui' : 'Pengeluaran baru berhasil dicatat');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/pengeluaran/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      showAlert.success('Catatan pengeluaran berhasil dihapus');
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Terjadi kesalahan saat menghapus');
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

  // Client-side filtering and pagination
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter((item: any) => {
      const keterangan = item.keterangan || '';
      const kategoriNama = item.kategori?.nama || '';
      const query = searchQuery.toLowerCase();
      
      const matchSearch = keterangan.toLowerCase().includes(query) || kategoriNama.toLowerCase().includes(query);
      const matchKategori = kategoriFilter === 'Semua' || item.kategori?.nama === kategoriFilter;
      
      return matchSearch && matchKategori;
    });
  }, [data, searchQuery, kategoriFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data pengeluaran.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Manajemen Pengeluaran</h2>
          <p className="text-slate-500 text-sm mt-1">Catat dan pantau seluruh pengeluaran operasional properti Anda.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Catat Pengeluaran
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-xs relative">
              <Input
                placeholder="Cari keterangan atau kategori..."
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset page on search
                }}
                className="bg-white"
              />
            </div>
            <div className="w-full sm:w-auto flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <Select 
                value={kategoriFilter} 
                onChange={(e) => {
                  setKategoriFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white min-w-[160px]"
              >
                <option value="Semua">Semua Kategori</option>
                {kategori?.map((k: any) => (
                  <option key={k.id} value={k.nama}>{k.nama}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-navy">Tanggal</TableHead>
                <TableHead className="font-bold text-navy">Kategori</TableHead>
                <TableHead className="font-bold text-navy">Keterangan</TableHead>
                <TableHead className="font-bold text-navy">Nominal</TableHead>
                <TableHead className="text-right font-bold text-navy">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Receipt className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-slate-500">Tidak ada pengeluaran ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <div className="flex items-center text-sm font-medium text-slate-700">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-700">{item.kategori?.nama}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 line-clamp-2 max-w-xs">{item.keterangan || '-'}</span>
                    </TableCell>
                    <TableCell className="font-black text-danger">
                      - Rp {formatRupiah(item.nominal)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-primary hover:bg-blue-50 w-8 h-8 p-0" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)} className="text-danger hover:bg-red-50 w-8 h-8 p-0" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-center">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-bold text-navy">Properti Kost</label>
              <Select
                value={formData.kost_id}
                onChange={(e) => setFormData({ ...formData, kost_id: e.target.value })}
                required
              >
                <option value="">-- Pilih Properti --</option>
                {kosts?.map((k: any) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Kategori</label>
              <Select
                value={formData.kategori_id}
                onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                required
              >
                <option value="">-- Kategori --</option>
                {kategori?.map((k: any) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Tanggal Transaksi</label>
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-bold text-navy">Nominal Keluar (Rp)</label>
              <Input
                type="text"
                placeholder="250.000"
                value={formData.nominal ? formatRupiah(formData.nominal) : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, nominal: val });
                }}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-bold text-navy">Keterangan / Detail</label>
              <Input
                placeholder="Cth: Pembayaran PLN bulan berjalan"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending} className="shadow-md">
              {editingId ? 'Simpan Perubahan' : 'Catat Pengeluaran'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              Apakah Anda yakin ingin menghapus catatan pengeluaran <strong className="font-black text-danger">{selectedItem?.kategori?.nama}</strong> senilai <strong className="font-black">Rp {formatRupiah(selectedItem?.nominal || 0)}</strong>? Tindakan ini akan memengaruhi laporan keuangan bulanan.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
            >
              Ya, Hapus Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
