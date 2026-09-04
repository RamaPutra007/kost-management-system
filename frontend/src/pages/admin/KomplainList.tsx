import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Search, MessageSquare, AlertCircle, Clock, CheckCircle2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { showAlert } from '@/lib/utils';

export function KomplainList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKomplain, setSelectedKomplain] = useState<any>(null);
  const [tanggapanText, setTanggapanText] = useState('');
  const [statusVal, setStatusVal] = useState('Menunggu');
  const queryClient = useQueryClient();

  const { data: komplains, isLoading, error } = useQuery({
    queryKey: ['admin_komplains'],
    queryFn: async () => {
      const res = await api.get('/komplain');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status, tanggapan }: { id: number, status: string, tanggapan?: string }) => {
      return await api.put(`/komplain/${id}`, { status, tanggapan });
    },
    onSuccess: () => {
      showAlert.success('Tanggapan berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['admin_komplains'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Gagal menyimpan tanggapan');
    }
  });

  const handleOpenModal = (komplain: any) => {
    setSelectedKomplain(komplain);
    setStatusVal(komplain.status);
    setTanggapanText(komplain.tanggapan || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKomplain) return;
    mutation.mutate({ 
      id: selectedKomplain.id, 
      status: statusVal, 
      tanggapan: tanggapanText 
    });
  };

  const filteredData = komplains?.filter((item: any) =>
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.penghuni?.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data komplain.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Layanan & Komplain</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola keluhan dan permintaan layanan dari penghuni.</p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <Input
            placeholder="Cari penghuni, kategori, atau deskripsi..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
             <div className="text-center py-12">
               <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-slate-900">Belum ada komplain</h3>
               <p className="text-slate-500 mt-1">Tidak ada data komplain yang ditemukan.</p>
             </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredData.map((komplain: any) => (
                <div key={komplain.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          komplain.status === 'Selesai' ? 'success' :
                          komplain.status === 'Diproses' ? 'warning' : 'default'
                        }>
                          {komplain.status === 'Menunggu' && <Clock className="w-3 h-3 mr-1 inline" />}
                          {komplain.status === 'Selesai' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                          {komplain.status}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                          {komplain.kategori}
                        </span>
                      </div>
                      <p className="text-slate-800 text-base">{komplain.deskripsi}</p>
                      <div className="text-xs text-slate-500 mt-3 flex items-center gap-4">
                        <span>Oleh: <strong className="text-slate-700">{komplain.penghuni?.nama_lengkap || 'Unknown'}</strong> (Kamar {komplain.kamar?.nomor_kamar || '-'})</span>
                        <span>Dibuat pada {format(new Date(komplain.created_at), 'dd MMM yyyy, HH:mm', { locale: localeID })}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                      <Button size="sm" onClick={() => handleOpenModal(komplain)}>Balas & Ubah Status</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Balas Komplain Penghuni"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status Komplain</label>
            <Select
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value)}
              className="w-full"
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggapan Anda</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
              placeholder="Tuliskan tanggapan Anda di sini..."
              value={tanggapanText}
              onChange={(e) => setTanggapanText(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Menyimpan...' : 'Simpan Tanggapan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
