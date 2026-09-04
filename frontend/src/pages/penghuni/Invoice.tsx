import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Printer, ArrowLeft } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: tagihan, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      // This uses the same endpoint but ideally we'd fetch a single tagihan by ID
      // However, we can fetch all and find, or just assume the backend has /tagihan/:id
      // Let's use the plural /tagihan since we might not have a single show method ready
      const res = await api.get('/tagihan');
      const allTagihan = res.data.data || res.data;
      const found = allTagihan.find((t: any) => t.id.toString() === id);
      if (!found) throw new Error('Invoice not found');
      return found;
    }
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  if (error || !tagihan) return <div className="p-8 text-center text-red-500">Invoice tidak ditemukan.</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
        <Button onClick={handlePrint} className="bg-navy text-white">
          <Printer className="w-4 h-4 mr-2" /> Cetak / PDF
        </Button>
      </div>

      <style type="text/css">
        {`
          @media print {
            @page { margin: 0; }
            body { padding: 2cm; }
          }
        `}
      </style>

      <div className="bg-white p-8 sm:p-12 shadow-sm border border-slate-200 rounded-xl print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-navy mb-2">INVOICE</h1>
            <p className="text-sm text-slate-500">
              No. Invoice: <span className="font-bold text-slate-800">INV-{tagihan.bulan_tagihan.replace('-', '')}-{tagihan.id.toString().padStart(4, '0')}</span>
            </p>
            <p className="text-sm text-slate-500">
              Tanggal: {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
            </p>
            <p className="text-sm text-slate-500">
              Waktu: {format(new Date(), 'HH:mm', { locale: localeID })} WIB
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-primary">Kostku</h2>
            <p className="text-sm text-slate-500 mt-1">Jl. Contoh Kost No. 123<br />Jakarta Selatan, 12345</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ditagihkan Kepada</p>
            <p className="font-bold text-slate-800 text-lg">{tagihan.penghuni?.nama_lengkap || 'Penghuni'}</p>
            <p className="text-sm text-slate-600 mt-1">Kamar: {(tagihan.kontrakSewa || tagihan.kontrak_sewa)?.kamar?.nomor_kamar || '-'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status Pembayaran</p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-sm">
              LUNAS
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-slate-800">
              <th className="py-3 text-left text-sm font-bold text-slate-800">Deskripsi</th>
              <th className="py-3 text-right text-sm font-bold text-slate-800">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-4 text-sm text-slate-600">
                Sewa Kamar Kost (Bulan {tagihan.bulan_tagihan})
              </td>
              <td className="py-4 text-sm text-right text-slate-800 font-medium">
                Rp {formatRupiah(tagihan.nominal)}
              </td>
            </tr>
            {Number(tagihan.denda) > 0 && (
              <tr className="border-b border-slate-100">
                <td className="py-4 text-sm text-slate-600">Denda Keterlambatan</td>
                <td className="py-4 text-sm text-right text-slate-800 font-medium">
                  Rp {formatRupiah(tagihan.denda)}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-4 text-right text-sm font-bold text-slate-800 uppercase tracking-wider pr-8">
                Total Lunas
              </td>
              <td className="py-4 text-right text-xl font-black text-navy">
                Rp {formatRupiah(tagihan.total_tagihan)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-200 mt-12">
          <p className="text-sm text-slate-500 font-medium">Terima kasih atas pembayaran Anda.</p>
        </div>
      </div>
    </div>
  );
}
