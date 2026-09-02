import React, { useState, useMemo } from 'react';
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
import { Pagination } from '@/components/ui/Pagination';
import { toast } from 'react-hot-toast';
import { Search, Filter, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

export function KamarList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Search, Filter, Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    mutationFn: async (submitData: any) => {
      if (editingId) {
        return await api.put(`/kamar/${editingId}`, submitData);
      } else {
        return await api.post('/kamar', submitData);
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

  // Client-side filtering and pagination
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter((kamar: any) => {
      const matchSearch = kamar.nomor_kamar.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          kamar.tipe.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'Semua' || kamar.status === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data kamar.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Manajemen Kamar</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola daftar kamar, tipe, harga, dan ketersediaan.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Tambah Kamar
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-xs relative">
              <Input
                placeholder="Cari nomor atau tipe..."
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
                value={statusFilter} 
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white min-w-[140px]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Kosong">Kosong</option>
                <option value="Terisi">Terisi</option>
                <option value="Perbaikan">Perbaikan</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-navy">No. Kamar</TableHead>
                <TableHead className="font-bold text-navy">Tipe</TableHead>
                <TableHead className="font-bold text-navy">Harga/Bulan</TableHead>
                <TableHead className="font-bold text-navy">Status</TableHead>
                <TableHead className="text-right font-bold text-navy">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-slate-500">Tidak ada data kamar ditemukan.</p>
                      <p className="text-xs">Coba ubah kata kunci pencarian atau filter Anda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((kamar: any) => (
                  <TableRow key={kamar.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-bold text-navy">{kamar.nomor_kamar}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{kamar.tipe}</TableCell>
                    <TableCell className="font-semibold text-slate-700">Rp {Number(kamar.harga).toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant={kamar.status === 'Terisi' ? 'success' : kamar.status === 'Kosong' ? 'default' : 'warning'}>
                        {kamar.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(kamar)} className="text-primary hover:bg-blue-50 w-8 h-8 p-0" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(kamar)} className="text-danger hover:bg-red-50 w-8 h-8 p-0" title="Hapus">
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
        title={editingId ? 'Edit Kamar' : 'Tambah Kamar Baru'}
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
              <label className="text-sm font-bold text-navy">Nomor Kamar</label>
              <Input
                placeholder="Cth: 101"
                value={formData.nomor_kamar}
                onChange={(e) => setFormData({ ...formData, nomor_kamar: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Tipe Kamar</label>
              <Input
                placeholder="Cth: VIP, Standard"
                value={formData.tipe}
                onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Harga / Bulan (Rp)</label>
              <Input
                type="number"
                placeholder="1500000"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Kosong">Kosong</option>
                <option value="Terisi">Terisi</option>
                <option value="Perbaikan">Perbaikan</option>
              </Select>
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending} className="shadow-md">
              {editingId ? 'Simpan Perubahan' : 'Tambah Kamar'}
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
              Apakah Anda yakin ingin menghapus kamar <strong className="font-black text-danger">{selectedItem?.nomor_kamar}</strong>?
              Semua data riwayat yang terkait dengan kamar ini mungkin akan terpengaruh.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
            >
              Ya, Hapus Permanen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
