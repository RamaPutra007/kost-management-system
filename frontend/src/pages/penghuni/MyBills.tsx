import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';
import { showAlert } from '@/lib/utils';
import { formatRupiah } from '@/lib/utils';

export function MyBills() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<any>(null);
  const [buktiFile, setBuktiFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    tagihan_id: '',
    nominal_bayar: '',
    payment_method_id: '',
    tanggal_bayar: new Date().toISOString().split('T')[0],
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['my_tagihan'],
    queryFn: async () => {
      const res = await api.get('/tagihan');
      return res.data.data || res.data;
    }
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment_methods'],
    queryFn: async () => {
      const res = await api.get('/payment_methods');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      return await api.post('/pembayaran', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_tagihan'] });
      queryClient.invalidateQueries({ queryKey: ['my_pembayaran'] });
      showAlert.success('Pembayaran berhasil disubmit dan menunggu verifikasi.');
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      showAlert.error(err.response?.data?.message || 'Terjadi kesalahan saat memproses pembayaran.');
    }
  });

  const handlePay = (tagihan: any) => {
    setSelectedTagihan(tagihan);
    setBuktiFile(null);
    setFormData({
      tagihan_id: tagihan.id,
      nominal_bayar: Math.floor(Number(tagihan.total_tagihan)).toString(),
      payment_method_id: paymentMethods?.[0]?.id || '',
      tanggal_bayar: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('tagihan_id', formData.tagihan_id);
    payload.append('nominal_bayar', formData.nominal_bayar);
    payload.append('tanggal_bayar', formData.tanggal_bayar);
    
    const selectedMethod = paymentMethods?.find((m: any) => m.id.toString() === formData.payment_method_id);
    payload.append('metode_pembayaran', selectedMethod ? selectedMethod.nama_provider : 'Transfer');

    if (buktiFile) {
      payload.append('bukti_pembayaran', buktiFile);
    }
    mutation.mutate(payload);
  };

  const selectedPaymentMethod = paymentMethods?.find((m: any) => m.id.toString() === formData.payment_method_id);

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tagihan Saya</h2>
          <p className="text-gray-500">Lihat dan bayar tagihan Anda.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bulan</TableHead>
                <TableHead>Kamar</TableHead>
                <TableHead>Total Tagihan</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Belum ada data tagihan.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.bulan_tagihan}</TableCell>
                    <TableCell>{(item.kontrakSewa || item.kontrak_sewa)?.kamar?.nomor_kamar || '-'}</TableCell>
                    <TableCell>Rp {formatRupiah(item.total_tagihan)}</TableCell>
                    <TableCell>{item.jatuh_tempo}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Lunas' ? 'success' : item.status === 'Belum Lunas' ? 'danger' : 'warning'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === 'Lunas' ? (
                        <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10" onClick={() => window.location.href = `/my-bills/invoice/${item.id}`}>Cetak Invoice</Button>
                      ) : item.status === 'Menunggu Verifikasi' ? (
                        <Button size="sm" variant="secondary" disabled>Menunggu</Button>
                      ) : (
                        <Button size="sm" onClick={() => handlePay(item)}>Bayar</Button>
                      )}
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
        title="Form Pembayaran"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bulan Tagihan</label>
            <Input value={selectedTagihan?.bulan_tagihan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nominal Bayar (Rp)</label>
            <Input
              type="text"
              value={formatRupiah(formData.nominal_bayar)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, nominal_bayar: rawValue });
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal Bayar</label>
            <Input
              type="date"
              value={formData.tanggal_bayar}
              onChange={(e) => setFormData({ ...formData, tanggal_bayar: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Metode Pembayaran</label>
            <Select
              value={formData.payment_method_id}
              onChange={(e) => setFormData({ ...formData, payment_method_id: e.target.value })}
              required
            >
              {paymentMethods?.map((method: any) => (
                <option key={method.id} value={method.id}>
                  {method.tipe} - {method.nama_provider}
                </option>
              ))}
            </Select>
          </div>

          {selectedPaymentMethod && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-navy mb-2">Instruksi Pembayaran</h4>
              {selectedPaymentMethod.tipe === 'QRIS' ? (
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">{selectedPaymentMethod.nama_provider}</p>
                  {selectedPaymentMethod.qr_image ? (
                    <img src={selectedPaymentMethod.qr_image.startsWith('http') ? selectedPaymentMethod.qr_image : `http://kost-management-system.test${selectedPaymentMethod.qr_image}`} alt="QRIS" className="mx-auto w-64 h-64 sm:w-80 sm:h-80 object-contain bg-white p-3 rounded-lg border shadow-sm" />
                  ) : (
                    <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto bg-slate-200 flex items-center justify-center rounded-lg">
                      <span className="text-slate-500 text-sm">QRIS belum diupload</span>
                    </div>
                  )}
                  {selectedPaymentMethod.instruksi && <p className="text-xs text-slate-500 mt-2">{selectedPaymentMethod.instruksi}</p>}
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p><span className="text-slate-500">Bank:</span> <span className="font-bold">{selectedPaymentMethod.nama_provider}</span></p>
                  <p><span className="text-slate-500">No. Rekening:</span> <span className="font-bold">{selectedPaymentMethod.nomor_rekening}</span></p>
                  <p><span className="text-slate-500">Atas Nama:</span> <span className="font-bold">{selectedPaymentMethod.atas_nama}</span></p>
                  {selectedPaymentMethod.instruksi && <p className="text-xs text-slate-500 mt-2">{selectedPaymentMethod.instruksi}</p>}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Bukti Pembayaran (Gambar)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setBuktiFile(e.target.files[0]);
                }
              }}
              required
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending}>Submit Pembayaran</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
