import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  X, 
  Building2, 
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Home,
  Users,
  FileText,
  CreditCard,
  Wallet,
  Settings,
  PieChart,
  User,
  MessageSquare,
  Megaphone,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  brandName?: string;
  userRole: string;
}

export function Sidebar({ 
  isOpen, 
  setIsOpen, 
  isCollapsed, 
  setIsCollapsed,
  brandName = 'KOSTKU',
  userRole
}: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const getRoleBasedItems = () => {
    switch (userRole) {
      case 'Owner':
        return [
          {
            title: 'Menu Utama',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ]
          },
          {
            title: 'Manajemen Data',
            items: [
              { name: 'Kamar', path: '/kamar', icon: Home },
              { name: 'Penghuni', path: '/penghuni', icon: Users },
              { name: 'Kontrak', path: '/kontrak', icon: FileText },
            ]
          },
          {
            title: 'Keuangan',
            items: [
              { name: 'Tagihan', path: '/tagihan', icon: CreditCard },
              { name: 'Pembayaran', path: '/pembayaran', icon: Wallet },
              { name: 'Pengeluaran', path: '/pengeluaran', icon: PieChart },
              { name: 'Laporan', path: '/laporan', icon: FileText },
            ]
          },
          {
            title: 'Layanan & Operasional',
            items: [
              { name: 'Paket', path: '/paket', icon: Package },
              { name: 'Pengumuman', path: '/pengumuman', icon: Megaphone },
              { name: 'Layanan & Komplain', path: '/komplain', icon: MessageSquare },
            ]
          },
          {
            title: 'Pengaturan',
            items: [
              { name: 'Pengguna', path: '/pengguna', icon: Users },
            ]
          }
        ];
      case 'Admin':
        return [
          {
            title: 'Menu Utama',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ]
          },
          {
            title: 'Manajemen Data',
            items: [
              { name: 'Kamar', path: '/kamar', icon: Home },
              { name: 'Penghuni', path: '/penghuni', icon: Users },
              { name: 'Kontrak', path: '/kontrak', icon: FileText },
            ]
          },
          {
            title: 'Keuangan',
            items: [
              { name: 'Tagihan', path: '/tagihan', icon: CreditCard },
              { name: 'Pembayaran', path: '/pembayaran', icon: Wallet },
              { name: 'Pengeluaran', path: '/pengeluaran', icon: PieChart },
              { name: 'Laporan', path: '/laporan', icon: FileText },
            ]
          },
          {
            title: 'Layanan & Operasional',
            items: [
              { name: 'Paket', path: '/paket', icon: Package },
              { name: 'Pengumuman', path: '/pengumuman', icon: Megaphone },
              { name: 'Layanan & Komplain', path: '/komplain', icon: MessageSquare },
            ]
          }
        ];
      case 'Penghuni':
      default:
        return [
          {
            title: 'Menu Utama',
            items: [
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ]
          },
          {
            title: 'Keuangan',
            items: [
              { name: 'Tagihan', path: '/my-bills', icon: CreditCard },
              { name: 'Pembayaran', path: '/my-payments', icon: Wallet },
            ]
          },
          {
            title: 'Layanan',
            items: [
              { name: 'Layanan & Komplain', path: '/my-complaints', icon: MessageSquare },
              { name: 'Paket Saya', path: '/my-packages', icon: Package },
            ]
          }
        ];
    }
  };

  const navGroups = getRoleBasedItems();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-navy border-r border-slate-800 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl lg:shadow-none flex flex-col h-full",
          isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
          isCollapsed && !isOpen ? "lg:w-20" : "w-72"
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between px-4 border-b border-slate-800/60 bg-navy">
          <Link to="/" className="flex items-center justify-center space-x-3 w-full" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 shrink-0 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {(!isCollapsed || isOpen) && (
              <span className="text-2xl font-extrabold text-white tracking-tight animate-in fade-in flex-1 truncate">
                {brandName}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar">
          <div className="space-y-6">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {(!isCollapsed || isOpen) && (
                  <div className="px-4 text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">
                    {group.title}
                  </div>
                )}
                {group.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={isCollapsed && !isOpen ? item.name : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center rounded-xl text-sm font-bold transition-all duration-200 group relative",
                        isCollapsed && !isOpen ? "justify-center px-0 py-3" : "px-4 py-3.5",
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300",
                          (!isCollapsed || isOpen) && "mr-4"
                        )}
                      />
                      {(!isCollapsed || isOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                      {isActive && isCollapsed && !isOpen && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-slate-800/60 bg-navy shrink-0 flex flex-col space-y-2">
          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 text-slate-500 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}
