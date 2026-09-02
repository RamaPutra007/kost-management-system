import React, { useState } from 'react';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { Input } from '../ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    role: { name: string };
  } | null;
}

export function Navbar({ onMenuClick, user }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, toggle dark class on document.documentElement
  };

  const profileMenu = [
    { label: 'Profil Saya', onClick: () => navigate('/profil') },
    { label: 'Pengaturan', onClick: () => navigate('/pengaturan') },
    { label: 'Keluar', danger: true, onClick: logout }
  ];

  return (
    <header className="flex h-20 shrink-0 items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200">
      <div className="flex items-center flex-1">
        <button
          className="lg:hidden p-2 -ml-2 mr-4 text-slate-500 hover:text-navy hover:bg-slate-100 focus:outline-none rounded-xl transition-colors shrink-0"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        
        {/* Global Search */}
        <div className="hidden sm:block max-w-md w-full">
          <Input 
            placeholder="Cari kamar, penghuni, tagihan..." 
            leftIcon={<Search className="w-5 h-5" />}
            className="h-11 bg-slate-100 border-transparent focus:bg-white rounded-2xl"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={handleToggleTheme}
          className="p-2.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Menu */}
        <button className="relative p-2.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 hidden sm:block mx-2"></div>

        {/* Profile Menu */}
        <Dropdown 
          align="right"
          items={profileMenu}
          trigger={
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-4 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
              <Avatar 
                size="md" 
                fallback={user?.name?.charAt(0).toUpperCase()} 
                className="bg-primary-light text-primary font-bold shadow-sm"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-navy leading-none mb-1.5">{user?.name || 'User'}</p>
                <p className="text-xs font-medium text-slate-500 leading-none">{user?.role?.name || 'Role'}</p>
              </div>
            </div>
          }
        />
      </div>
    </header>
  );
}
