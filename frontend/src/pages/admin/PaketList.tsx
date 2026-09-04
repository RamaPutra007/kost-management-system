import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Package, Search, Plus, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function PaketList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ penghuni_id: '', nama_kurir: '', deskripsi: '' });
  const queryClient = useQueryClient();

  const { data: pakets = [], isLoading } = useQuery({
    queryKey: ['paket'],
    queryFn: async () => {
      const res = await api.get('/paket');
      return res.data.data;
    }
  });

  const { data: penghunis = [] } = useQuery({
    queryKey: ['penghuni'],
    queryFn: async () => {
      const res = await api.get('/penghuni');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/paket', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paket'] });
      toast.success('Paket berhasil dicatat dan penghuni telah dinotifikasi');
      setShowForm(false);
      setFormData({ penghuni_id: '', nama_kurir: '', deskripsi: '' });
    },
    onError: () => toast.error('Gagal mencatat paket')
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await api.put(`/paket/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paket'] });
      toast.success('Status paket berhasil diperbarui');
    }
  });

  const filteredPakets = pakets.filter((p: any) => 
    p.penghuni?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nama_kurir?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manajemen Paket</h1>
          <p className="text-slate-500">Kelola paket masuk untuk penghuni kos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Catat Paket Baru
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl">
          <h3 className="text-lg font-bold text-navy mb-4">Catat Paket Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-navy">Penghuni Penerima *</label>
              <select 
                className="w-full flex h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                value={formData.penghuni_id}
                onChange={(e) => setFormData({ ...formData, penghuni_id: e.target.value })}
              >
                <option value="">Pilih Penghuni</option>
                {penghunis.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.name} - Kamar {p.kamar?.nomor_kamar}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-navy">Kurir / Ekspedisi</label>
              <Input 
                placeholder="Misal: JNE, J&T, Gojek..." 
                value={formData.nama_kurir}
                onChange={(e) => setFormData({ ...formData, nama_kurir: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-navy">Keterangan Tambahan</label>
              <Input 
                placeholder="Misal: Ditaruh di rak sepatu, atau paket besar..." 
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
            <Button 
              onClick={() => createMutation.mutate(formData)}
              disabled={!formData.penghuni_id || createMutation.isPending}
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Simpan & Notifikasi'}
            </Button>
          </div>
        </Card>
      )}

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-xl">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari penghuni atau kurir..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="font-bold text-navy">Penerima</TableHead>
                <TableHead className="font-bold text-navy">Kamar</TableHead>
                <TableHead className="font-bold text-navy">Kurir</TableHead>
                <TableHead className="font-bold text-navy">Waktu Diterima</TableHead>
                <TableHead className="font-bold text-navy">Status</TableHead>
                <TableHead className="font-bold text-navy text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredPakets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Tidak ada data paket.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPakets.map((paket: any) => (
                  <TableRow key={paket.id} className="group hover:bg-slate-50/80 border-b border-slate-50 transition-colors">
                    <TableCell className="font-semibold text-navy">{paket.penghuni?.user?.name}</TableCell>
                    <TableCell>{paket.penghuni?.kamar?.nomor_kamar}</TableCell>
                    <TableCell>{paket.nama_kurir || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(paket.tanggal_diterima), "dd MMM yyyy, HH:mm", { locale: id })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={paket.status === 'Sudah Diambil' ? 'success' : 'warning'}>
                        {paket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {paket.status === 'Menunggu Diambil' && (
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => updateStatusMutation.mutate({ id: paket.id, status: 'Sudah Diambil' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" /> Diserahkan
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
