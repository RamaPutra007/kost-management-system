import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Dummy data to make the notification feature functional and visually complete
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Pembayaran Diterima',
    message: 'Pembayaran tagihan kos bulan September 2026 telah diverifikasi.',
    time: '2 jam yang lalu',
    type: 'success',
    isRead: false,
  },
  {
    id: 2,
    title: 'Peringatan Tagihan',
    message: 'Tagihan listrik bulan Agustus 2026 belum dibayar.',
    time: '5 jam yang lalu',
    type: 'warning',
    isRead: false,
  },
  {
    id: 3,
    title: 'Info Pemeliharaan',
    message: 'Akan ada pemadaman air sementara besok pukul 10:00 - 14:00.',
    time: '1 hari yang lalu',
    type: 'info',
    isRead: true,
  },
  {
    id: 4,
    title: 'Kontrak Baru Ditambahkan',
    message: 'Anda baru saja membuat kontrak baru untuk kamar B-02.',
    time: '3 hari yang lalu',
    type: 'success',
    isRead: true,
  }
];

export function Notifications() {
  const [notifications, setNotifications] = React.useState(DUMMY_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
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
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-5 rounded-2xl border transition-all ${notif.isRead ? 'bg-white border-slate-200' : 'bg-primary/5 border-primary/20 shadow-sm'}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`mt-0.5 p-2 rounded-xl ${notif.isRead ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                    <h3 className={`text-base font-bold ${notif.isRead ? 'text-slate-700' : 'text-navy'}`}>
                      {notif.title}
                    </h3>
                    <span className="flex items-center text-xs font-medium text-slate-400 mt-1 sm:mt-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {notif.time}
                    </span>
                  </div>
                  <p className={`text-sm ${notif.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                    {notif.message}
                  </p>
                </div>
              </div>
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
