import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export function ProblemSolutionSection() {
  const problems = [
    "Tagihan manual tercecer & susah ditagih",
    "Bingung rekap uang masuk dan keluar",
    "Data penghuni berantakan di buku catatan",
    "Sering lupa jadwal kontrak habis"
  ];

  const solutions = [
    "Auto-generate & notifikasi tagihan ke WhatsApp",
    "Sistem pembukuan otomatis & realtime",
    "Database digital aman di Cloud",
    "Alert perpanjangan otomatis H-7"
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-navy tracking-tight mb-4">
            Berhenti Mengelola Secara Manual
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Waktu Anda terlalu berharga untuk mengurus catatan kertas dan nagih satu per satu. Biarkan sistem yang bekerja.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Problems */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-red-500/5 border-2 border-red-50">
            <h3 className="text-2xl font-bold text-navy mb-8 flex items-center">
              <span className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <XCircle className="w-6 h-6 text-danger" />
              </span>
              Cara Lama
            </h3>
            <ul className="space-y-6">
              {problems.map((prob, i) => (
                <li key={i} className="flex items-start">
                  <XCircle className="w-6 h-6 text-red-300 mr-4 shrink-0 mt-0.5" />
                  <span className="text-slate-600 font-medium text-lg">{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="bg-navy rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center relative z-10">
              <span className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </span>
              Dengan KOSTKU
            </h3>
            <ul className="space-y-6 relative z-10">
              {solutions.map((sol, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5 mr-4" />
                  <span className="text-slate-300 font-medium text-lg">{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
