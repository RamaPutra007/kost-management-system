import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Menu, X, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Fitur', href: '#fitur' },
    { name: 'Cara Kerja', href: '#cara-kerja' },
    { name: 'Tampilan', href: '#tampilan' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Kontak', href: '#kontak' },
  ];

  return (
    <section id="beranda" className="relative bg-background pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] max-w-7xl">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse" />
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      {/* Sticky Navbar */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 z-50">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-navy tracking-tight">KOSTKU</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-bold text-slate-600 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/login">
              <Button variant="primary" className="rounded-full px-6 shadow-md shadow-primary/20">
                Mulai Sekarang
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-50 p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-0 left-0 w-full h-screen bg-white z-40 flex flex-col justify-center items-center space-y-6 md:hidden animate-in slide-in-from-top-4 duration-300">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-xl font-bold text-navy"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col space-y-4 w-full px-8 pt-8 border-t border-slate-100">
                <Link to="/login" className="w-full text-center py-3 text-lg font-bold text-slate-600">Login</Link>
                <Link to="/login">
                  <Button variant="primary" size="lg" className="w-full rounded-full">Mulai Sekarang</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span>Sistem Manajemen Kost #1 di Indonesia</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-navy tracking-tight mb-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 leading-tight">
          Kelola Kost Lebih <span className="text-primary bg-primary/10 px-4 py-1 rounded-2xl whitespace-nowrap">Mudah</span>,<br className="hidden md:block" /> Lebih Teratur, Lebih Menguntungkan
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Platform all-in-one cerdas untuk mengelola data kamar, penghuni, kontrak sewa, tagihan, pembayaran otomatis, hingga pembukuan keuangan kost Anda dalam satu layar.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link to="/login">
            <Button size="xl" variant="primary" className="w-full sm:w-auto rounded-full shadow-xl shadow-primary/30 group">
              Mulai Sekarang Gratis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#tampilan">
            <Button size="xl" variant="outline" className="w-full sm:w-auto rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 group">
              <PlayCircle className="mr-2 w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              Lihat Tampilan
            </Button>
          </a>
        </div>
      </div>

      {/* Dashboard Mockup Showcase */}
      <div className="relative mt-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 z-10 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
        <div className="rounded-2xl md:rounded-[2rem] p-2 md:p-4 bg-white/40 backdrop-blur-2xl shadow-2xl shadow-navy/5 border border-white/60">
          <div className="bg-navy rounded-xl md:rounded-[1.5rem] overflow-hidden shadow-2xl relative border border-slate-800">
            {/* Mockup Header bar */}
            <div className="h-10 bg-slate-900 flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {/* Mockup Content */}
            <div className="aspect-[16/9] md:aspect-[16/10] bg-slate-50 w-full relative overflow-hidden">
              {/* Fake Sidebar */}
              <div className="absolute left-0 top-0 bottom-0 w-48 lg:w-64 bg-navy p-4 hidden sm:block border-r border-slate-800/50">
                <div className="h-8 w-32 bg-slate-800 rounded-lg mb-8" />
                <div className="space-y-3">
                  <div className="h-10 w-full bg-primary rounded-xl" />
                  <div className="h-10 w-full bg-slate-800/50 rounded-xl" />
                  <div className="h-10 w-full bg-slate-800/50 rounded-xl" />
                  <div className="h-10 w-full bg-slate-800/50 rounded-xl" />
                </div>
              </div>
              {/* Fake Main Content */}
              <div className="absolute left-0 right-0 sm:left-48 lg:left-64 top-0 bottom-0 p-4 lg:p-8 bg-slate-50 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-8 w-40 bg-slate-200 rounded-lg" />
                  <div className="h-10 w-10 bg-slate-200 rounded-full" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                  <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                    <div className="h-4 w-24 bg-slate-100 rounded-md" />
                    <div className="h-8 w-32 bg-slate-800 rounded-md" />
                  </div>
                  <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                    <div className="h-4 w-24 bg-slate-100 rounded-md" />
                    <div className="h-8 w-32 bg-primary rounded-md" />
                  </div>
                  <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hidden md:flex flex-col justify-between">
                    <div className="h-4 w-24 bg-slate-100 rounded-md" />
                    <div className="h-8 w-32 bg-slate-800 rounded-md" />
                  </div>
                  <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hidden lg:flex flex-col justify-between">
                    <div className="h-4 w-24 bg-slate-100 rounded-md" />
                    <div className="h-8 w-32 bg-slate-800 rounded-md" />
                  </div>
                </div>
                <div className="h-64 bg-white rounded-2xl shadow-sm border border-slate-100" />
              </div>
              
              {/* Floating Decorative Cards */}
              <div className="absolute -right-4 top-1/4 w-48 h-32 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-4 h-4 text-green-600 font-bold text-xs">✓</div>
                  </div>
                  <div>
                    <div className="h-3 w-20 bg-slate-200 rounded mb-1" />
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-3/4 bg-slate-800 rounded mb-2" />
                <div className="h-8 w-full bg-green-50 rounded-lg mt-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">Lunas Rp1.500.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
