import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-gray-300 bg-slate-50',
        className
      )}
      {...props}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-navy mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-6 max-w-sm">{description}</p>}
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
