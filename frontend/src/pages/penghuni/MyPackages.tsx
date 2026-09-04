import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Package, Loader2, Calendar, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function MyPackages() {
  const { data: pakets = [], isLoading } = useQuery({
    queryKey: ['my-packages'],
    queryFn: async () => {
      const res = await api.get('/paket');
      return res.data.data;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Paket Saya</h1>
        <p className="text-slate-500">Lacak paket yang masuk untuk Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Memuat paket Anda...</p>
          </div>
        ) : pakets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-semibold text-navy">Belum Ada Paket</p>
            <p className="text-sm mt-1">Saat ini tidak ada paket yang ditujukan untuk Anda.</p>
          </div>
        ) : (
          pakets.map((paket: any) => (
            <Card key={paket.id} className="p-6 rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="w-6 h-6" />
                </div>
                <Badge variant={paket.status === 'Sudah Diambil' ? 'success' : 'warning'} className="shadow-sm">
                  {paket.status}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-navy text-lg">{paket.nama_kurir || 'Kurir Ekspedisi'}</h3>
                  {paket.deskripsi && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{paket.deskripsi}</p>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="text-slate-500 mr-2">Diterima:</span>
                    <span className="font-medium text-navy">
                      {format(new Date(paket.tanggal_diterima), "dd MMM yyyy, HH:mm", { locale: id })}
                    </span>
                  </div>
                  
                  {paket.status === 'Sudah Diambil' && paket.tanggal_diambil && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Check className="w-4 h-4 mr-2 text-emerald-500" />
                      <span className="text-slate-500 mr-2">Diambil:</span>
                      <span className="font-medium text-navy">
                        {format(new Date(paket.tanggal_diambil), "dd MMM yyyy, HH:mm", { locale: id })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
