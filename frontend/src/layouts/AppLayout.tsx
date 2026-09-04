import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen print:h-auto bg-background overflow-hidden print:overflow-visible font-sans">
      <div className="print:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          brandName="KOSTKU"
          userRole={user?.role?.name || ''}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible relative transition-all duration-300">
        <div className="print:hidden">
          <Navbar
            onMenuClick={() => setIsSidebarOpen(true)}
            user={user}
          />
        </div>

        <div className="flex-1 overflow-auto print:overflow-visible bg-slate-50 relative">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">


            <Outlet />
          </div>

          {/* Footer */}
          <footer className="w-full border-t border-slate-200 bg-white py-6 mt-8 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} KOSTKU. All rights reserved.</p>
              <div className="flex space-x-4 mt-2 sm:mt-0">
                <a href="#" className="hover:text-primary">Bantuan</a>
                <a href="#" className="hover:text-primary">Privasi</a>
                <a href="#" className="hover:text-primary">Ketentuan</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
