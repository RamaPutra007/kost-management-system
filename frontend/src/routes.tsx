import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Landing } from '@/pages/Landing';

import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Owner & Admin Pages
import { KamarList } from '@/pages/admin/Kamar/KamarList';
import { PenghuniList } from '@/pages/admin/Penghuni/PenghuniList';
import { KontrakList } from '@/pages/admin/Kontrak/KontrakList';
import { TagihanList } from '@/pages/admin/Tagihan/TagihanList';
import { PembayaranList } from '@/pages/admin/Pembayaran/PembayaranList';
import { PengeluaranList } from '@/pages/admin/Pengeluaran/PengeluaranList';

// Penghuni Pages
import { MyDashboard } from '@/pages/penghuni/MyDashboard';
import { MyRoom } from '@/pages/penghuni/MyRoom';
import { MyBills } from '@/pages/penghuni/MyBills';
import { MyPayments } from '@/pages/penghuni/MyPayments';

// Unified Dashboard Entry
import { DashboardEntry } from '@/pages/DashboardEntry';

// New Functionality
import { Notifications } from '@/pages/Notifications';
import { Profil } from '@/pages/Profil';
import { Laporan } from '@/pages/admin/Laporan';
import { Pengguna } from '@/pages/admin/Pengguna';
import { Pengaturan } from '@/pages/admin/Pengaturan';
import { ComingSoon } from '@/pages/ComingSoon';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    element: <ProtectedRoute allowedRoles={['Admin', 'Owner', 'Penghuni']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Unified Dashboard Entry
          { path: '/dashboard', element: <DashboardEntry /> },

          { path: '/kamar', element: <ProtectedRoute allowedRoles={['Admin', 'Owner']}><KamarList /></ProtectedRoute> },
          { path: '/penghuni', element: <ProtectedRoute allowedRoles={['Admin', 'Owner']}><PenghuniList /></ProtectedRoute> },
          { path: '/kontrak', element: <ProtectedRoute allowedRoles={['Admin', 'Owner']}><KontrakList /></ProtectedRoute> },
          { path: '/tagihan', element: <ProtectedRoute allowedRoles={['Admin', 'Owner']}><TagihanList /></ProtectedRoute> },
          { path: '/pembayaran', element: <ProtectedRoute allowedRoles={['Admin', 'Owner']}><PembayaranList /></ProtectedRoute> },
          { path: '/pengeluaran', element: <ProtectedRoute allowedRoles={['Admin', 'Owner']}><PengeluaranList /></ProtectedRoute> },
          { path: '/laporan', element: <ProtectedRoute allowedRoles={['Admin', 'Owner']}><Laporan /></ProtectedRoute> },
          { path: '/pengguna', element: <ProtectedRoute allowedRoles={['Owner']}><Pengguna /></ProtectedRoute> },
          { path: '/pengaturan', element: <ProtectedRoute allowedRoles={['Owner']}><Pengaturan /></ProtectedRoute> },
          { path: '/notifikasi', element: <Notifications /> },
          { path: '/profil', element: <Profil /> },

          // Penghuni Routes
          { path: '/my-room', element: <ProtectedRoute allowedRoles={['Penghuni']}><MyRoom /></ProtectedRoute> },
          { path: '/my-contract', element: <Navigate to="/my-room" replace /> },
          { path: '/my-bills', element: <ProtectedRoute allowedRoles={['Penghuni']}><MyBills /></ProtectedRoute> },
          { path: '/my-payments', element: <ProtectedRoute allowedRoles={['Penghuni']}><MyPayments /></ProtectedRoute> },
          { path: '/my-profile', element: <ProtectedRoute allowedRoles={['Penghuni']}><Profil /></ProtectedRoute> },
          { path: '/my-notifications', element: <ProtectedRoute allowedRoles={['Penghuni']}><Notifications /></ProtectedRoute> },
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">403</h1>
          <p className="text-gray-500 mt-2">Unauthorized access</p>
        </div>
      </div>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  }
]);