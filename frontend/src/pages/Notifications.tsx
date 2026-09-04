import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { showAlert } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showAlert.success('Notifikasi berhasil dihapus');
    },
    onError: () => {
      showAlert.error('Gagal menghapus notifikasi');
    }
  });

  const readMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const markAllAsRead = () => {
    const unreadNotifs = notifications.filter((n: any) => !n.is_read);
    unreadNotifs.forEach((n: any) => readMutation.mutate(n.id));
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('sukses') || t.includes('diterima') || t.includes('berhasil')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
    if (t.includes('peringatan') || t.includes('tagihan') || t.includes('terlambat')) {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center space-x-2">
            <Bell className="w-6 h-6 text-primary" />
            <span>Notifikasi</span>
          </h1>
          <p className="text-slate-500 mt-1">Anda memiliki {unreadCount} pesan belum dibaca.</p>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Memuat notifikasi...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notif: any) => (
            <div 
              key={notif.id} 
              className={`p-5 rounded-2xl border transition-all ${notif.is_read ? 'bg-white border-slate-200' : 'bg-primary/5 border-primary/20 shadow-sm'} group relative`}
            >
              <div className="flex items-start space-x-4">
                <div className={`mt-0.5 p-2 rounded-xl ${notif.is_read ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                  {getIcon(notif.title)}
                </div>
                <div className="flex-1 pr-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                    <h3 className={`text-base font-bold ${notif.is_read ? 'text-slate-700' : 'text-navy'}`}>
                      {notif.title}
                    </h3>
                    <span className="flex items-center text-xs font-medium text-slate-400 mt-1 sm:mt-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: localeId })}
                    </span>
                  </div>
                  <p className={`text-sm ${notif.is_read ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                    {notif.message}
                  </p>
                  
                  {!notif.is_read && (
                    <button 
                      onClick={() => readMutation.mutate(notif.id)}
                      className="text-xs font-bold text-primary mt-2 hover:underline"
                    >
                      Tandai sudah dibaca
                    </button>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => deleteMutation.mutate(notif.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-danger hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Hapus notifikasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-navy mb-1">Tidak Ada Notifikasi</h3>
            <p className="text-slate-500">Anda belum memiliki notifikasi apapun saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
