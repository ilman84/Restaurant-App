import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = '', variant = 'default', size = 'default', ...props },
    ref
  ) => {
    const variantClass =
      variant === 'destructive'
        ? 'bg-[#c12116] text-white hover:bg-[#a01a12]'
        : variant === 'outline'
        ? 'border border-[#d5d7da] bg-white hover:bg-[#f5f5f5] text-[#0a0d12]'
        : variant === 'ghost'
        ? 'bg-transparent hover:bg-[#f5f5f5] text-[#0a0d12]'
        : 'bg-[#c12116] text-white hover:bg-[#a01a12]';

    const sizeClass =
      size === 'sm'
        ? 'h-8 px-3 text-sm'
        : size === 'lg'
        ? 'h-12 px-6 text-[16px]'
        : 'h-11 px-5 text-[16px]';

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-[100px] transition-colors ${variantClass} ${sizeClass} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
