import React from 'react';

export default function SkeletonLoader({ className = '', variant = 'rectangular' }) {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700/50';
  
  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
}
