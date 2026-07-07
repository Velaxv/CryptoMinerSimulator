import React from 'react';

interface BadgeProps {
  variant?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'blue', 
  children,
  className = '' 
}) => {
  const variantClasses = {
    green: 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30',
    blue: 'bg-[#60A5FA]/20 text-[#60A5FA] border-[#60A5FA]/30',
    orange: 'bg-[#FB923C]/20 text-[#FB923C] border-[#FB923C]/30',
    red: 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]/30',
    purple: 'bg-[#A78BFA]/20 text-[#A78BFA] border-[#A78BFA]/30'
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
