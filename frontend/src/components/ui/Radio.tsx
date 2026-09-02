import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center space-x-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="radio"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div className={cn(
            "w-5 h-5 rounded-full border border-gray-300 bg-white transition-all peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:border-primary group-hover:border-primary flex items-center justify-center",
            className
          )}>
            <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {label && <span className="text-sm font-medium text-slate-700 select-none group-hover:text-slate-900 transition-colors">{label}</span>}
      </label>
    );
  }
);
Radio.displayName = 'Radio';
