import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Plus, Search, MessageSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { showAlert } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export function ComingSoon({ title = 'Coming Soon' }: { title?: string }) {
    // keeping this export here in case other routes use it, but MyComplaints is the real page now
    return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-6 rounded-full bg-slate-100 p-6">
                <AlertCircle className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-navy">{title}</h2>
            <p className="text-slate-500 max-w-md">Fitur ini sedang dalam tahap pengembangan dan akan segera tersedia.</p>
        </div>
    );
}

export function MyComplaints() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    kategori: 'Fasilitas',
    deskripsi: '',
  });

  const { data: komplains, isLoading, error } = useQuery({
    queryKey: ['my_komplains'],
    queryFn: async () => {
      const res = await api.get('/komplain');
      return res.data.data || res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post('/komplain', payload);
    },
    onSuccess: () => {
      showAlert.success('Komplain berhasil dikirim');
      queryClient.invalidateQueries({ queryKey: ['my_komplains'] });
      setIsModalOpen(false);
      setFormData({ kategori: 'Fasilitas', deskripsi: '' });
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Gagal mengirim komplain');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deskripsi.trim()) {
      showAlert.error('Deskripsi tidak boleh kosong');
      return;
    }
    mutation.mutate(formData);
  };

  const filteredData = komplains?.filter((item: any) =>
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) return <div className="flex justify-center p-12"><Spinner className="w-10 h-10 text-primary" /></div>;
  if (error) return <div className="p-4 text-red-500 font-bold text-center">Gagal memuat data komplain.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">Layanan & Komplain</h2>
          <p className="text-slate-500 text-sm mt-1">Sampaikan keluhan atau permintaan layanan terkait kamar Anda.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Buat Komplain Baru
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <Input
            placeholder="Cari riwayat komplain..."
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
               <p className="text-slate-500 mt-1">Anda belum membuat keluhan atau permintaan layanan apapun.</p>
             </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredData.map((komplain: any) => (
                <div key={komplain.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex-1 w-full">
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
                      
                      {komplain.tanggapan && (
                        <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                          <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1 flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" /> Tanggapan Admin
                          </p>
                          <p className="text-sm text-slate-700">{komplain.tanggapan}</p>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 mt-4 flex items-center">
                        Dibuat pada {format(new Date(komplain.created_at), 'dd MMM yyyy, HH:mm', { locale: localeID })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Komplain Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <Select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full"
            >
              <option value="Fasilitas">Fasilitas & Barang</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Lainnya">Lainnya</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Lengkap</label>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ceritakan detail keluhan atau permintaan Anda..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            ></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Mengirim...' : 'Kirim Komplain'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
