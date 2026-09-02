import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CtaFooterSection() {
  return (
    <>
      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl mix-blend-overlay" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Siap Mengubah Cara Anda Mengelola Kost?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan pemilik kost lainnya yang telah merasakan kemudahan manajemen digital bersama KOSTKU.
          </p>
          <Link to="/login">
            <Button size="xl" variant="secondary" className="rounded-full shadow-2xl group text-primary font-bold">
              Mulai Sekarang — Gratis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer & Kontak */}
      <footer id="kontak" className="bg-navy pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2.5 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">KOSTKU</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Sistem manajemen properti terpadu untuk kost, kontrakan, dan apartemen di Indonesia.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Produk</h4>
              <ul className="space-y-4">
                <li><a href="#fitur" className="text-slate-400 hover:text-primary transition-colors text-sm">Fitur Utama</a></li>
                <li><a href="#tampilan" className="text-slate-400 hover:text-primary transition-colors text-sm">Tampilan Aplikasi</a></li>
                <li><a href="#cara-kerja" className="text-slate-400 hover:text-primary transition-colors text-sm">Cara Kerja</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Perusahaan</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Tentang Kami</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Syarat & Ketentuan</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Kebijakan Privasi</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Kontak Kami</h4>
              <ul className="space-y-4">
                <li className="flex items-start text-slate-400 text-sm">
                  <MapPin className="w-5 h-5 text-primary mr-3 shrink-0" />
                  <span>Gedung KOSTKU, Jl. Sudirman No.123, Jakarta Selatan</span>
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                  <Phone className="w-5 h-5 text-primary mr-3 shrink-0" />
                  <span>+62 811-2233-4455</span>
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                  <Mail className="w-5 h-5 text-primary mr-3 shrink-0" />
                  <span>halo@kostku.id</span>
                </li>
              </ul>
            </div>
            
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} KOSTKU. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
