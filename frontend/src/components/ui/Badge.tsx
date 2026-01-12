import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
  className?: string;
}

export const Badge = ({ children, variant = 'gray', className }: BadgeProps) => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={cn(
      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
