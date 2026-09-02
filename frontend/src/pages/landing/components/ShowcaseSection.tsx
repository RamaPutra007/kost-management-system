import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Shield, Briefcase } from 'lucide-react';

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState('owner');

  const tabs = [
    { id: 'owner', label: 'Owner Dashboard', icon: Briefcase, color: 'text-amber-500 bg-amber-50' },
    { id: 'admin', label: 'Admin Panel', icon: Shield, color: 'text-primary bg-primary/10' },
    { id: 'penghuni', label: 'Penghuni Portal', icon: User, color: 'text-green-500 bg-green-50' }
  ];

  return (
    <section id="tampilan" className="py-20 md:py-32 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Satu Platform, Multi Akses</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-navy tracking-tight max-w-3xl mx-auto">
            Didesain Khusus Untuk Setiap Peran
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-3 px-6 py-3 rounded-full font-bold transition-all duration-300 border-2",
                  isActive 
                    ? "border-primary bg-white shadow-lg text-navy" 
                    : "border-transparent bg-slate-100 text-slate-500 hover:bg-white hover:text-navy"
                )}
              >
                <div className={cn("p-1.5 rounded-full", tab.color)}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mockup Container based on Active Tab */}
        <div className="max-w-5xl mx-auto bg-white p-2 sm:p-4 rounded-[2rem] shadow-2xl border border-slate-100 transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="aspect-[16/10] sm:aspect-[16/9] bg-slate-900 rounded-2xl sm:rounded-[1.5rem] overflow-hidden relative shadow-inner">
            
            {/* Fake OS Header */}
            <div className="h-10 bg-slate-800 flex items-center px-4 space-x-2 w-full absolute top-0 z-10 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 text-center text-xs font-medium text-slate-400">
                app.kostku.id/{activeTab}
              </div>
            </div>

            <div className="w-full h-full pt-10 flex">
              {/* Fake Sidebar */}
              <div className="w-48 sm:w-64 bg-navy border-r border-slate-800 p-4 hidden md:block shrink-0">
                <div className="h-6 w-32 bg-slate-700 rounded-md mb-8" />
                <div className="space-y-3">
                  <div className="h-10 w-full bg-primary rounded-xl" />
                  <div className="h-10 w-full bg-slate-800 rounded-xl" />
                  <div className="h-10 w-full bg-slate-800 rounded-xl" />
                  {activeTab !== 'penghuni' && (
                    <div className="h-10 w-full bg-slate-800 rounded-xl" />
                  )}
                  {activeTab === 'owner' && (
                    <div className="h-10 w-full bg-slate-800 rounded-xl" />
                  )}
                </div>
              </div>

              {/* Fake Content */}
              <div className="flex-1 bg-slate-50 p-4 sm:p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-8 w-40 bg-slate-200 rounded-lg" />
                  <div className="h-10 w-10 bg-slate-200 rounded-full" />
                </div>
                
                {/* Specific Layout per tab */}
                {activeTab === 'owner' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 shadow-sm" />)}
                    </div>
                    <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm flex items-end p-6 space-x-2">
                       {/* Fake Chart */}
                       {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                         <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }}>
                           <div className="w-full bg-primary rounded-t-sm" style={{ height: '4px' }} />
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === 'admin' && (
                  <div className="space-y-6">
                    <div className="h-12 bg-white rounded-xl border border-slate-200 shadow-sm w-full" />
                    <div className="h-[400px] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-4">
                      <div className="h-8 bg-slate-100 rounded mb-4" />
                      {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-50 border-b border-slate-100 mb-2 rounded" />)}
                    </div>
                  </div>
                )}

                {activeTab === 'penghuni' && (
                  <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="h-40 bg-gradient-to-r from-primary to-blue-400 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                      <div className="h-6 w-32 bg-white/20 rounded-md" />
                      <div className="h-12 w-48 bg-white rounded-md shadow-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm" />
                       <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
