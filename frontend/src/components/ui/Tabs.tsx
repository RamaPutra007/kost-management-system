import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  defaultTab?: string;
  onTabChange?: (id: string) => void;
}

export function Tabs({ className, items, defaultTab, onTabChange, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onTabChange) onTabChange(id);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 relative top-[1px]",
                isActive 
                  ? "border-primary text-primary" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="pt-6">
        {items.find((item) => item.id === activeTab)?.content}
      </div>
    </div>
  );
}
