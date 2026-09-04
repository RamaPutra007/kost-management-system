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
import { showAlert } from '@/lib/utils';
import { Search, Filter, Plus, Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export function KontrakList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Search, Filter, and Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const mutation = useMutation({
    mutationFn: async (submitData: any) => {
      if (editingId) {
        return await api.put(`/kontrak_sewa/${editingId}`, submitData);
      } else {
        return await api.post('/kontrak_sewa', submitData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontrak_sewa'] });
      queryClient.invalidateQueries({ queryKey: ['kamar'] });
      showAlert.success(editingId ? 'Kontrak berhasil diperbarui' : 'Kontrak baru berhasil dibuat');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Gagal menyimpan kontrak');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/kontrak_sewa/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontrak_sewa'] });
      queryClient.invalidateQueries({ queryKey: ['kamar'] });
      showAlert.success('Kontrak berhasil dihapus');
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Gagal menghapus kontrak');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return await api.put(`/kontrak_sewa/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontrak_sewa'] });
      queryClient.invalidateQueries({ queryKey: ['kamar'] });
      showAlert.success('Status kontrak berhasil diperbarui');
      setIsStatusModalOpen(false);
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

  const handleEdit = (kontrak: any) => {
    setEditingId(kontrak.id);
    setFormData({
      kamar_id: kontrak.kamar_id,
      penghuni_id: kontrak.penghuni_id,
      tanggal_mulai: kontrak.tanggal_mulai.split('T')[0], // format to YYYY-MM-DD if needed
      tanggal_selesai: kontrak.tanggal_selesai.split('T')[0],
      harga_kesepakatan: kontrak.harga_kesepakatan,
      deposit: kontrak.deposit || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (kontrak: any) => {
    setSelectedItem(kontrak);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      kamar_id: kamars?.[0]?.id || '',
      penghuni_id: penghunis?.[0]?.id || '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      harga_kesepakatan: kamars?.[0]?.harga || '',
      deposit: '',
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
      const kamarNo = item.kamar?.nomor_kamar || '';
      const penghuniName = item.penghuni?.user?.name || '';
      const query = searchQuery.toLowerCase();
      
      const matchSearch = kamarNo.toLowerCase().includes(query) || penghuniName.toLowerCase().includes(query);
      const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data kontrak.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Kontrak Sewa</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola data penyewaan kamar, periode, dan harga kesepakatan.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Buat Kontrak Baru
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-xs relative">
              <Input
                placeholder="Cari kamar atau penghuni..."
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
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
                <option value="Batal">Batal</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-navy">Kamar</TableHead>
                <TableHead className="font-bold text-navy">Penghuni</TableHead>
                <TableHead className="font-bold text-navy">Periode Sewa</TableHead>
                <TableHead className="font-bold text-navy">Nilai Kontrak</TableHead>
                <TableHead className="font-bold text-navy">Status</TableHead>
                <TableHead className="text-right font-bold text-navy">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-slate-500">Tidak ada kontrak ditemukan.</p>
                      <p className="text-xs">Coba sesuaikan kata kunci pencarian Anda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-bold text-navy">
                      Kamar {item.kamar?.nomor_kamar}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-slate-700">{item.penghuni?.user?.name || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <span className="mx-1 text-slate-300">-</span>
                        {new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      Rp {formatRupiah(item.harga_kesepakatan)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Aktif' ? 'success' : item.status === 'Selesai' ? 'default' : 'danger'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openStatusModal(item)} className="text-slate-500 hover:bg-slate-100 hover:text-navy px-2 py-1 h-auto text-xs font-semibold" title="Ubah Status">
                          Ubah Status
                        </Button>
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

      {/* Modal Tambah / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Kontrak Sewa" : "Buat Kontrak Sewa Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy flex items-center">
              Kamar { !editingId && <span className="text-xs font-normal text-slate-400 ml-2">(Hanya yang kosong)</span> }
            </label>
            <Select
              value={formData.kamar_id}
              onChange={(e) => {
                const selectedKamarId = e.target.value;
                const selectedKamar = kamars?.find((k: any) => k.id.toString() === selectedKamarId);
                setFormData({ 
                  ...formData, 
                  kamar_id: selectedKamarId,
                  harga_kesepakatan: selectedKamar ? selectedKamar.harga : formData.harga_kesepakatan
                });
              }}
              required
            >
              <option value="">-- Pilih Kamar --</option>
              {editingId && !kamars?.find((k: any) => k.id === selectedItem?.kamar_id) && (
                <option value={formData.kamar_id}>Kamar Terpilih Saat Ini</option>
              )}
              {kamars?.map((k: any) => (
                <option key={k.id} value={k.id}>Kamar {k.nomor_kamar} - Rp {formatRupiah(k.harga)}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Penghuni</label>
            <Select
              value={formData.penghuni_id}
              onChange={(e) => setFormData({ ...formData, penghuni_id: e.target.value })}
              required
            >
              <option value="">-- Pilih Penghuni Terdaftar --</option>
              {penghunis?.map((p: any) => (
                <option key={p.id} value={p.id}>{p.user?.name} ({p.nik})</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Tanggal Mulai</label>
              <Input
                type="date"
                value={formData.tanggal_mulai}
                onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Tanggal Selesai</label>
              <Input
                type="date"
                value={formData.tanggal_selesai}
                onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Harga Kesepakatan / Bulan (Rp)</label>
            <Input
              type="text"
              placeholder="1.500.000"
              value={formData.harga_kesepakatan ? formatRupiah(formData.harga_kesepakatan) : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, harga_kesepakatan: val });
              }}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Deposit Opsional (Rp)</label>
            <Input
              type="text"
              placeholder="0"
              value={formData.deposit ? formatRupiah(formData.deposit) : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, deposit: val });
              }}
            />
          </div>
          
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending} className="shadow-md">
              {editingId ? 'Simpan Perubahan' : 'Simpan Kontrak'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Ubah Status */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Ubah Status Kontrak"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl mb-4 text-sm text-slate-600">
            Anda akan mengubah status kontrak untuk <strong className="text-navy">{selectedItem?.penghuni?.user?.name}</strong> di <strong className="text-navy">Kamar {selectedItem?.kamar?.nomor_kamar}</strong>.
            Jika diubah ke <strong>Selesai</strong> atau <strong>Batal</strong>, status kamar akan otomatis menjadi <strong>Kosong</strong>.
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Status Kontrak</label>
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
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsStatusModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={updateStatusMutation.isPending} className="shadow-md">Simpan Perubahan</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Hapus */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              Apakah Anda yakin ingin menghapus kontrak sewa untuk <strong className="font-black text-danger">{selectedItem?.penghuni?.user?.name}</strong> di Kamar <strong className="font-black text-danger">{selectedItem?.kamar?.nomor_kamar}</strong>?
              Data yang dihapus tidak dapat dikembalikan. Kamar akan otomatis diubah statusnya menjadi Kosong.
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
