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
import { Search, Filter, Plus, Calendar, AlertCircle, FileText } from 'lucide-react';

export function TagihanList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search, Filter, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    mutationFn: async (submitData: any) => {
      return await api.post('/tagihan', submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
      toast.success('Tagihan baru berhasil diterbitkan');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menerbitkan tagihan');
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

  // Client-side filtering and pagination
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter((item: any) => {
      const penghuniName = item.penghuni?.user?.name || '';
      const kamarNo = item.kontrak?.kamar?.nomor_kamar || '';
      const query = searchQuery.toLowerCase();
      
      const matchSearch = penghuniName.toLowerCase().includes(query) || kamarNo.toLowerCase().includes(query);
      const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data tagihan.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Data Tagihan</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola tagihan sewa bulanan dan jatuh tempo penghuni.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Buat Tagihan Baru
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-xs relative">
              <Input
                placeholder="Cari penghuni atau kamar..."
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
                className="bg-white min-w-[150px]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Terlambat">Terlambat</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-navy">Bulan Tagihan</TableHead>
                <TableHead className="font-bold text-navy">Penghuni / Kamar</TableHead>
                <TableHead className="font-bold text-navy">Total Tagihan</TableHead>
                <TableHead className="font-bold text-navy">Jatuh Tempo</TableHead>
                <TableHead className="font-bold text-navy">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-slate-500">Tidak ada tagihan ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item: any) => {
                  // highlight if overdue and unpaid
                  const isOverdue = item.status === 'Belum Lunas' && new Date(item.jatuh_tempo) < new Date();
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-bold text-navy">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          {new Date(item.bulan_tagihan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-700">{item.penghuni?.user?.name || '-'}</p>
                        <p className="text-xs text-slate-500">Kamar {item.kontrak?.kamar?.nomor_kamar || '-'}</p>
                      </TableCell>
                      <TableCell className="font-black text-navy text-base">
                        Rp {Number(item.total_tagihan).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${isOverdue ? 'text-danger' : 'text-slate-600'}`}>
                          {new Date(item.jatuh_tempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {isOverdue && (
                          <div className="flex items-center text-[10px] text-danger mt-0.5">
                            <AlertCircle className="w-3 h-3 mr-1" /> Terlewat
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Lunas' ? 'success' : isOverdue ? 'danger' : 'warning'}>
                          {isOverdue ? 'Terlambat' : item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
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

      {/* Modal Tambah */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Terbitkan Tagihan Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Pilih Kontrak Sewa Aktif</label>
            <Select
              value={formData.kontrak_sewa_id}
              onChange={handleKontrakChange}
              required
            >
              <option value="">-- Pilih Penghuni & Kamar --</option>
              {kontrak?.map((k: any) => (
                <option key={k.id} value={k.id}>
                  Kamar {k.kamar?.nomor_kamar} - {k.penghuni?.user?.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Periode Tagihan</label>
              <Input
                type="date"
                value={formData.bulan_tagihan}
                onChange={(e) => setFormData({ ...formData, bulan_tagihan: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Tenggat Waktu</label>
              <Input
                type="date"
                value={formData.jatuh_tempo}
                onChange={(e) => setFormData({ ...formData, jatuh_tempo: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Sewa Pokok (Rp)</label>
              <Input
                type="number"
                value={formData.nominal}
                onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy">Biaya Lain/Denda (Rp)</label>
              <Input
                type="number"
                value={formData.denda}
                onChange={(e) => setFormData({ ...formData, denda: e.target.value })}
              />
            </div>
          </div>
          
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={createMutation.isPending} className="shadow-md">Terbitkan Tagihan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
