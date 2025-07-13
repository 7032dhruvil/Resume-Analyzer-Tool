import React from 'react';

const Logo = ({ className = '', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  return (
    <img 
      src="/logo.webp" 
      alt="Logo" 
      className={`${sizeClasses[size]} object-contain ${className}`}
      loading="lazy"
    />
  );
};

export default Logo; 