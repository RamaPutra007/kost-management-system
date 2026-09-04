import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { toast } from 'react-hot-toast';
import { showAlert } from '@/lib/utils';
import { Search, Plus, Edit2, Trash2, AlertCircle, UserPlus, Phone, Mail, CreditCard } from 'lucide-react';

// Helper to get initials
const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function PenghuniList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nik: '',
    telepon: '',
    kontak_darurat: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['penghuni'],
    queryFn: async () => {
      const res = await api.get('/penghuni');
      return res.data.data || res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (submitData: any) => {
      if (editingId) {
        return await api.put(`/penghuni/${editingId}`, submitData);
      } else {
        return await api.post('/penghuni', submitData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penghuni'] });
      showAlert.success(editingId ? 'Data penghuni berhasil diperbarui' : 'Penghuni baru berhasil ditambahkan');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Terjadi kesalahan saat memproses data');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/penghuni/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penghuni'] });
      showAlert.success('Data penghuni berhasil dihapus');
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Gagal menghapus penghuni');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleEdit = (penghuni: any) => {
    setEditingId(penghuni.id);
    setFormData({
      name: penghuni.user?.name || '',
      email: penghuni.user?.email || '',
      password: '', // blank password on edit
      nik: penghuni.nik || '',
      telepon: penghuni.telepon || '',
      kontak_darurat: penghuni.kontak_darurat || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (penghuni: any) => {
    setSelectedItem(penghuni);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      nik: '',
      telepon: '',
      kontak_darurat: '',
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
      const name = item.user?.name || '';
      const email = item.user?.email || '';
      const telepon = item.telepon || '';
      const query = searchQuery.toLowerCase();
      
      return name.toLowerCase().includes(query) || 
             email.toLowerCase().includes(query) ||
             telepon.includes(query);
    });
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data penghuni.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Manajemen Penghuni</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola data penyewa, identitas, dan akses akun kost.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto shadow-sm">
          <UserPlus className="w-4 h-4 mr-2" /> Tambah Penghuni
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-md relative">
              <Input
                placeholder="Cari nama, email, atau nomor telepon..."
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset page on search
                }}
                className="bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-navy w-[300px]">Profil Penghuni</TableHead>
                <TableHead className="font-bold text-navy">Kontak</TableHead>
                <TableHead className="font-bold text-navy">NIK Identitas</TableHead>
                <TableHead className="text-right font-bold text-navy">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-slate-500">Tidak ada data penghuni ditemukan.</p>
                      <p className="text-xs">Coba sesuaikan kata kunci pencarian Anda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {getInitials(item.user?.name)}
                        </div>
                        <div>
                          <p className="font-bold text-navy">{item.user?.name || 'Anonim'}</p>
                          <p className="text-xs text-slate-500">{item.user?.email || 'Tidak ada email'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {item.telepon || '-'}
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                          <span className="text-[10px] uppercase font-bold text-slate-400 mr-2 border border-slate-200 px-1 rounded">Darurat</span>
                          {item.kontak_darurat || '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm font-medium text-slate-700">
                        <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                        {item.nik || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-primary hover:bg-blue-50 w-8 h-8 p-0" title="Edit Profil">
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
        title={editingId ? 'Edit Data Penghuni' : 'Daftarkan Penghuni Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-bold text-navy flex items-center">
                <UserPlus className="w-4 h-4 mr-2 text-slate-400" />
                Nama Lengkap Sesuai KTP
              </label>
              <Input
                placeholder="Cth: Budi Santoso"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy flex items-center">
                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                Alamat Email
              </label>
              <Input
                type="email"
                placeholder="budi@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!!editingId}
                className={editingId ? 'bg-slate-50 text-slate-500' : ''}
              />
              {editingId && <p className="text-[10px] text-slate-400">Email tidak dapat diubah setelah terdaftar.</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">
                Password Akun {editingId && <span className="text-xs font-normal text-slate-400">(Biarkan kosong)</span>}
              </label>
              <Input
                type="password"
                placeholder="Min. 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingId}
                minLength={6}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-bold text-navy flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                Nomor Induk Kependudukan (NIK)
              </label>
              <Input
                placeholder="16 Digit NIK KTP"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                required
                maxLength={16}
                minLength={16}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy flex items-center">
                <Phone className="w-4 h-4 mr-2 text-slate-400" />
                No. Telepon / WhatsApp
              </label>
              <Input
                placeholder="Cth: 081234567890"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Kontak Darurat</label>
              <Input
                placeholder="Keluarga / Kerabat"
                value={formData.kontak_darurat}
                onChange={(e) => setFormData({ ...formData, kontak_darurat: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending} className="shadow-md">
              {editingId ? 'Simpan Perubahan' : 'Daftarkan Penghuni'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Cabut Akses"
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">
                Anda akan menghapus profil dan akun login untuk <strong className="font-black text-danger">{selectedItem?.user?.name}</strong>.
              </p>
              <p className="text-xs text-red-600/80">Tindakan ini tidak dapat dikembalikan. Jika penghuni masih memiliki kontrak aktif, harap batalkan kontrak terlebih dahulu.</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
            >
              Ya, Hapus Akun
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
