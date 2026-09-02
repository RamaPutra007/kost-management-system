import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm focus:ring-primary/50',
      secondary: 'bg-slate-100 text-navy hover:bg-slate-200 focus:ring-slate-200',
      outline: 'border border-gray-200 text-navy hover:bg-slate-50 focus:ring-slate-100',
      ghost: 'text-slate-600 hover:text-navy hover:bg-slate-100 focus:ring-slate-100',
      danger: 'bg-danger text-white hover:bg-red-600 shadow-sm focus:ring-danger/50',
    };

    const sizes = {
      sm: 'text-xs h-8 px-3 rounded-lg',
      md: 'text-sm h-10 px-4 rounded-xl',
      lg: 'text-base h-12 px-6 rounded-2xl',
      xl: 'text-lg h-14 px-8 rounded-2xl',
      icon: 'h-10 w-10 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className="w-4 h-4 mr-2" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
