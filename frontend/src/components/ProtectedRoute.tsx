import React from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const {
    user,
    isLoading,
  } = useAuth();

  const location = useLocation();

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  // =====================================================
  // BELUM LOGIN
  // =====================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // =====================================================
  // AMBIL ROLE USER
  // =====================================================

  const userRole =
    user.role?.name?.trim().toLowerCase();

  // =====================================================
  // USER TIDAK MEMILIKI ROLE
  // =====================================================

  if (!userRole) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // =====================================================
  // CEK ROLE
  // =====================================================

  if (
    allowedRoles &&
    allowedRoles.length > 0
  ) {
    const normalizedAllowedRoles =
      allowedRoles.map((role) =>
        role.trim().toLowerCase()
      );

    const hasPermission =
      normalizedAllowedRoles.includes(
        userRole
      );

    if (!hasPermission) {
      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );
    }
  }

  // =====================================================
  // CHILDREN
  // =====================================================

  if (children) {
    return <>{children}</>;
  }

  // =====================================================
  // NESTED ROUTE / OUTLET
  // =====================================================

  return <Outlet />;
}