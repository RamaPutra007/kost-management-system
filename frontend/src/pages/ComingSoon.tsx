import React from 'react';
import { Hammer } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex-1 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        <p className="text-slate-500">Fitur ini sedang dalam tahap pengembangan.</p>
      </div>
      <EmptyState 
        icon={<Hammer className="w-12 h-12 text-primary" />} 
        title="Segera Hadir" 
        description={`Halaman ${title} sedang dibangun dan akan segera tersedia.`} 
      />
    </div>
  );
}
