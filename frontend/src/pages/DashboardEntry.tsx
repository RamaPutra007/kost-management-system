import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OwnerDashboard } from './admin/OwnerDashboard';
import { AdminDashboard } from './admin/AdminDashboard';
import { MyDashboard as PenghuniDashboard } from './penghuni/MyDashboard';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';

export function DashboardEntry() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role.name === 'Owner') {
    return <OwnerDashboard />;
  }

  if (user.role.name === 'Admin') {
    return <AdminDashboard />;
  }

  if (user.role.name === 'Penghuni') {
    return <PenghuniDashboard />;
  }

  return <Navigate to="/unauthorized" replace />;
}
