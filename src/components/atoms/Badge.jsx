import React from 'react';
import { cn } from '@/utils/cn';

const Badge = ({ 
  children, 
  variant = "default",
  size = "md",
  className,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-black",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
    sale: "bg-gradient-to-r from-secondary to-red-600 text-white font-bold transform rotate-3 shadow-lg"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;