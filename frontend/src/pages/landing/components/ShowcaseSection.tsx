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
              <div className="flex-1 bg-slate-50 p-4 sm:p-8 overflow-hidden overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                    <span className="text-slate-300">/</span>
                    <div className="h-4 w-20 bg-slate-300 rounded" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-slate-200 rounded-full" />
                    <div className="h-10 w-10 bg-primary/20 rounded-full border-2 border-white shadow-sm" />
                  </div>
                </div>
                
                {/* Specific Layout per tab */}
                {activeTab === 'owner' && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div>
                      <div className="h-6 w-64 bg-slate-800 rounded-md mb-2" />
                      <div className="h-3 w-48 bg-slate-400 rounded-md" />
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { bg: 'bg-blue-100', dot: 'bg-blue-500' },
                        { bg: 'bg-green-100', dot: 'bg-green-500' },
                        { bg: 'bg-amber-100', dot: 'bg-amber-500' },
                        { bg: 'bg-primary/10', dot: 'bg-primary' }
                      ].map((card, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-2">
                              <div className="h-2 w-16 bg-slate-300 rounded" />
                              <div className="h-5 w-24 bg-navy rounded" />
                            </div>
                            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                              <div className={`w-3 h-3 rounded-full ${card.dot}`} />
                            </div>
                          </div>
                          <div className="h-2 w-20 bg-slate-200 rounded" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 h-48 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
                        <div className="h-4 w-32 bg-slate-700 rounded mb-auto" />
                        <div className="flex items-end space-x-1 h-24 w-full mt-4">
                          {[40, 70, 45, 90, 65, 100, 80, 50, 85, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative" style={{ height: `${h}%` }}>
                              <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                         <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
                         <div className="flex justify-center items-center h-24">
                           <div className="w-24 h-24 rounded-full border-8 border-primary/20 border-t-primary border-r-green-500 border-b-amber-500" />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'admin' && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div>
                      <div className="h-6 w-56 bg-slate-800 rounded-md mb-2" />
                      <div className="h-3 w-64 bg-slate-400 rounded-md" />
                    </div>

                    <div className="flex gap-2 mb-2 overflow-hidden">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-8 w-28 bg-primary/90 rounded-md shrink-0" />
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="h-2 w-16 bg-slate-300 rounded" />
                            <div className="h-6 w-12 bg-navy rounded" />
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-slate-100" />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="h-40 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center mb-4">
                          <div className="w-4 h-4 bg-warning rounded mr-2" />
                          <div className="h-4 w-32 bg-slate-700 rounded" />
                        </div>
                        <div className="space-y-3">
                          {[1,2].map(i => (
                            <div key={i} className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200" />
                                <div className="space-y-1">
                                  <div className="h-2 w-20 bg-slate-600 rounded" />
                                  <div className="h-2 w-12 bg-slate-300 rounded" />
                                </div>
                              </div>
                              <div className="h-3 w-16 bg-slate-200 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-40 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center mb-4">
                          <div className="w-4 h-4 bg-danger rounded mr-2" />
                          <div className="h-4 w-32 bg-slate-700 rounded" />
                        </div>
                        <div className="space-y-3">
                          {[1,2].map(i => (
                            <div key={i} className="flex justify-between items-center">
                              <div className="space-y-1">
                                <div className="h-2 w-24 bg-slate-600 rounded" />
                                <div className="h-2 w-16 bg-slate-300 rounded" />
                              </div>
                              <div className="h-4 w-12 bg-danger/20 rounded-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'penghuni' && (
                  <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500 pt-4">
                    <div className="h-24 sm:h-32 bg-primary rounded-2xl shadow-lg p-6 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                      <div className="h-6 w-40 bg-white rounded-md mb-2 relative z-10" />
                      <div className="h-3 w-56 bg-primary-light/50 rounded-md relative z-10" />
                    </div>
                    
                    <div className="h-28 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
                      <div>
                        <div className="h-2 w-20 bg-slate-400 rounded mb-2" />
                        <div className="h-8 w-16 bg-navy rounded mb-2" />
                        <div className="h-4 w-12 bg-green-100 rounded-full" />
                      </div>
                      <div className="text-right">
                        <div className="h-2 w-20 bg-slate-400 rounded mb-2 ml-auto" />
                        <div className="h-6 w-24 bg-primary rounded mb-1 ml-auto" />
                        <div className="h-2 w-10 bg-slate-300 rounded ml-auto" />
                      </div>
                    </div>

                    <div className="h-24 bg-danger/5 rounded-xl border border-danger/20 shadow-sm p-5 flex justify-between items-center">
                      <div>
                        <div className="h-6 w-24 bg-danger rounded mb-2" />
                        <div className="h-3 w-16 bg-slate-400 rounded" />
                      </div>
                      <div className="h-8 w-28 bg-danger rounded-md" />
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
