import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children,
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'rounded font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm'
  };

  const variantClasses = {
    primary: 'bg-[#3B82F6] text-white hover:bg-[#2563EB] active:scale-95 disabled:bg-[#3B82F6]/50',
    secondary: 'bg-[#1E293B] text-[#F8FAFC] border border-[#263840] hover:bg-[#334155] active:scale-95 disabled:opacity-50',
    danger: 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/30 hover:bg-[#F87171]/30 active:scale-95 disabled:opacity-50',
    ghost: 'bg-transparent text-[#94A3B8] hover:bg-[#334155]/50 hover:text-[#F8FAFC] active:scale-95 disabled:opacity-50'
  };

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
