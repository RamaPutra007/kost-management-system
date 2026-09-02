import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PenghuniLayout } from './layouts/PenghuniLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { KamarList } from './pages/admin/Kamar/KamarList';
import { PenghuniList } from './pages/admin/Penghuni/PenghuniList';
import { KontrakList } from './pages/admin/Kontrak/KontrakList';
import { TagihanList } from './pages/admin/Tagihan/TagihanList';
import { PembayaranList } from './pages/admin/Pembayaran/PembayaranList';
import { PengeluaranList } from './pages/admin/Pengeluaran/PengeluaranList';
import { MyDashboard } from './pages/penghuni/MyDashboard';
import { MyRoom } from './pages/penghuni/MyRoom';
import { MyBills } from './pages/penghuni/MyBills';
import { MyPayments } from './pages/penghuni/MyPayments';
import { Landing } from './pages/Landing';

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
    element: <ProtectedRoute allowedRoles={['Admin', 'Owner']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/kamar', element: <KamarList /> },
          { path: '/penghuni', element: <PenghuniList /> },
          { path: '/kontrak', element: <KontrakList /> },
          { path: '/tagihan', element: <TagihanList /> },
          { path: '/pembayaran', element: <PembayaranList /> },
          { path: '/pengeluaran', element: <PengeluaranList /> },
          { path: '/pengguna', element: <div>Pengguna (WIP)</div> },
          { path: '/pengaturan', element: <div>Pengaturan (WIP)</div> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['Penghuni']} />,
    children: [
      {
        element: <PenghuniLayout />,
        children: [
          { path: '/my-dashboard', element: <MyDashboard /> },
          { path: '/my-room', element: <MyRoom /> },
          { path: '/my-contract', element: <Navigate to="/my-room" replace /> },
          { path: '/my-bills', element: <MyBills /> },
          { path: '/my-payments', element: <MyPayments /> },
          { path: '/my-profile', element: <div>My Profile (WIP)</div> },
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
