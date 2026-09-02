import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { toast } from 'react-hot-toast';
import { Search, Filter, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

export function PembayaranList() {
  const queryClient = useQueryClient();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [statusVerifikasi, setStatusVerifikasi] = useState('Pending');

  // Search, Filter, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['pembayaran'],
    queryFn: async () => {
      const res = await api.get('/pembayaran');
      return res.data.data || res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status_verifikasi }: { id: number, status_verifikasi: string }) => {
      return await api.put(`/pembayaran/${id}`, { status_verifikasi });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pembayaran'] });
      queryClient.invalidateQueries({ queryKey: ['tagihan'] }); // Refresh tagihan since status affects it
      toast.success('Status pembayaran berhasil diubah');
      setIsStatusModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat memverifikasi');
    }
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateStatusMutation.mutate({ id: selectedItem.id, status_verifikasi: statusVerifikasi });
    }
  };

  const openStatusModal = (pembayaran: any) => {
    setSelectedItem(pembayaran);
    setStatusVerifikasi(pembayaran.status_verifikasi);
    setIsStatusModalOpen(true);
  };

  // Client-side filtering and pagination
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter((item: any) => {
      const penghuniName = item.penghuni?.user?.name || '';
      const metode = item.metode_pembayaran || '';
      const query = searchQuery.toLowerCase();
      
      const matchSearch = penghuniName.toLowerCase().includes(query) || metode.toLowerCase().includes(query);
      const matchStatus = statusFilter === 'Semua' || item.status_verifikasi === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data pembayaran.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Verifikasi Pembayaran</h2>
          <p className="text-slate-500 text-sm mt-1">Pantau dan verifikasi setoran pembayaran dari penghuni kost.</p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-xs relative">
              <Input
                placeholder="Cari penghuni atau metode..."
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
                className="bg-white min-w-[160px]"
              >
                <option value="Semua">Semua Verifikasi</option>
                <option value="Pending">Pending</option>
                <option value="Valid">Valid</option>
                <option value="Invalid">Invalid</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-navy">Tanggal Bayar</TableHead>
                <TableHead className="font-bold text-navy">Penghuni</TableHead>
                <TableHead className="font-bold text-navy">Nominal Setoran</TableHead>
                <TableHead className="font-bold text-navy">Metode</TableHead>
                <TableHead className="font-bold text-navy">Status Verifikasi</TableHead>
                <TableHead className="text-right font-bold text-navy">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ShieldCheck className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-slate-500">Tidak ada riwayat pembayaran.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <div className="flex items-center text-sm font-medium text-slate-700">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(item.tanggal_bayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-navy">{item.penghuni?.user?.name || '-'}</span>
                    </TableCell>
                    <TableCell className="font-black text-navy">
                      Rp {Number(item.nominal_bayar).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-slate-600">
                        <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                        {item.metode_pembayaran}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status_verifikasi === 'Valid' ? 'success' : item.status_verifikasi === 'Invalid' ? 'danger' : 'warning'}>
                        {item.status_verifikasi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openStatusModal(item)} className="font-semibold hover:bg-slate-100 border-slate-200">
                        Verifikasi
                      </Button>
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

      {/* Modal Ubah Status */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Verifikasi Pembayaran"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-slate-700">
            Pastikan uang masuk sebesar <strong className="text-navy font-black">Rp {Number(selectedItem?.nominal_bayar).toLocaleString('id-ID')}</strong> dari <strong className="text-navy">{selectedItem?.penghuni?.user?.name}</strong> telah sesuai mutasi rekening.
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-navy">Keputusan Verifikasi</label>
            <Select
              value={statusVerifikasi}
              onChange={(e) => setStatusVerifikasi(e.target.value)}
              required
            >
              <option value="Pending">Tahan (Pending)</option>
              <option value="Valid">Sah (Valid) → Otomatis Lunas</option>
              <option value="Invalid">Tolak (Invalid)</option>
            </Select>
            <p className="text-[11px] text-slate-500 mt-1">Mengubah ke <span className="font-bold text-success">Valid</span> akan otomatis merubah status Tagihan terkait menjadi Lunas.</p>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsStatusModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={updateStatusMutation.isPending} className="shadow-md">Konfirmasi Keputusan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
