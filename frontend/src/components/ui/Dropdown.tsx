import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger?: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ className, trigger, items, align = 'right', ...props }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef} {...props}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
        {trigger || (
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none text-slate-500 hover:text-navy">
            <MoreVertical className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none py-1 animate-in fade-in slide-in-from-top-2 duration-200",
          align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
        )}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left flex items-center px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50",
                item.danger ? "text-danger hover:text-red-700" : "text-slate-700 hover:text-navy"
              )}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
