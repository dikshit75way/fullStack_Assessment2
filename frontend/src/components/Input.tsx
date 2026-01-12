import React from 'react';
import { twMerge } from 'tailwind-merge';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, icon, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={twMerge(
              cn(
                "appearance-none block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all",
                icon ? "pl-10 pr-3 py-2" : "px-3 py-2",
                error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                className
              )
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>}
      </div>
    );
  }
);
