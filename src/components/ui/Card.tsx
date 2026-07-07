import React from 'react';

interface CardProps {
  variant?: 'default' | 'active';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'default', 
  children, 
  className = '',
  onClick 
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200';
  const variantClasses = {
    default: 'bg-[#111A21] border border-[#263840] hover:border-[#334155]',
    active: 'bg-[#111A21] border border-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.3)]'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
