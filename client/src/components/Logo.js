import React from 'react';

const Logo = ({ className = '', size = 'default', showText = true, usePng = false, useSvg = false, pngSrc = '/logo.png' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  };

  // Use PNG logo if specified
  if (usePng) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <img 
          src={pngSrc} 
          alt="Resume Analyzer Logo" 
          className={`${sizeClasses[size]} object-contain`}
          onError={(e) => {
            // Fallback to default logo if PNG fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback logo (hidden by default) */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg`} style={{ display: 'none' }}>
          <svg 
            className={`${size === 'small' ? 'w-4 h-4' : size === 'default' ? 'w-6 h-6' : size === 'large' ? 'w-8 h-8' : size === 'xl' ? 'w-10 h-10' : 'w-12 h-12'} text-white`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        {showText && (
          <div className="flex flex-col">
            <span className={`font-bold ${textSizes[size]} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              Resume
            </span>
            <span className={`font-medium ${size === 'small' ? 'text-xs' : size === 'default' ? 'text-sm' : size === 'large' ? 'text-base' : size === 'xl' ? 'text-lg' : 'text-xl'} text-gray-600`}>
              Analyzer
            </span>
          </div>
        )}
      </div>
    );
  }

  // Use SVG logo if specified
  if (useSvg) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <img 
          src="/logo.svg" 
          alt="Resume Analyzer Logo" 
          className={`${sizeClasses[size]} object-contain`}
        />
        {showText && (
          <div className="flex flex-col">
            <span className={`font-bold ${textSizes[size]} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              Resume
            </span>
            <span className={`font-medium ${size === 'small' ? 'text-xs' : size === 'default' ? 'text-sm' : size === 'large' ? 'text-base' : size === 'xl' ? 'text-lg' : 'text-xl'} text-gray-600`}>
              Analyzer
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default gradient logo
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg`}>
        <svg 
          className={`${size === 'small' ? 'w-4 h-4' : size === 'default' ? 'w-6 h-6' : size === 'large' ? 'w-8 h-8' : size === 'xl' ? 'w-10 h-10' : 'w-12 h-12'} text-white`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizes[size]} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Resume
          </span>
          <span className={`font-medium ${size === 'small' ? 'text-xs' : size === 'default' ? 'text-sm' : size === 'large' ? 'text-base' : size === 'xl' ? 'text-lg' : 'text-xl'} text-gray-600`}>
            Analyzer
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo; 