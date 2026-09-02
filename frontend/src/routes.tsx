import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PenghuniLayout } from './layouts/PenghuniLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { KamarList } from './pages/admin/Kamar/KamarList';
import { PenghuniList } from './pages/admin/Penghuni/PenghuniList';
import { MyDashboard } from './pages/penghuni/MyDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
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
          { path: '/kontrak', element: <div>Kontrak Sewa (WIP)</div> },
          { path: '/tagihan', element: <div>Tagihan (WIP)</div> },
          { path: '/pembayaran', element: <div>Pembayaran (WIP)</div> },
          { path: '/pengeluaran', element: <div>Pengeluaran (WIP)</div> },
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
          { path: '/my-room', element: <div>My Room (WIP)</div> },
          { path: '/my-contract', element: <div>My Contract (WIP)</div> },
          { path: '/my-bills', element: <div>My Bills (WIP)</div> },
          { path: '/my-payments', element: <div>My Payments (WIP)</div> },
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
