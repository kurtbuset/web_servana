import React from 'react';

/**
 * LoadingSpinner Component
 * 
 * A reusable loading component with consistent styling across the application.
 * Provides different variants for different use cases.
 * 
 * @param {string} variant - 'page' | 'inline' | 'table' | 'button'
 * @param {string} message - Custom loading message
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const LoadingSpinner = ({ 
  variant = 'inline', 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-[#6237A0] ${sizeClasses[size]}`}></div>
  );

  // Full page loading screen
  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-[#6237A0]"></div>
          </div>
          <div className="mb-2">
            <svg width="120" height="40" viewBox="0 0 120 40" className="mx-auto">
              <text x="60" y="25" textAnchor="middle" className="fill-[#6237A0] text-xl font-bold">
                Servana
              </text>
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>
      </div>
    );
  }

  // Table row loading
  if (variant === 'table') {
    return (
      <tr>
        <td colSpan="100%" className="text-center py-8">
          <div className="flex items-center justify-center space-x-2">
            {spinner}
            <span className={`text-gray-600 ${textSizeClasses[size]}`}>{message}</span>
          </div>
        </td>
      </tr>
    );
  }

  // Button loading (inline with text)
  if (variant === 'button') {
    return (
      <div className="flex items-center justify-center space-x-2">
        {spinner}
        <span className={textSizeClasses[size]}>{message}</span>
      </div>
    );
  }

  // Default inline loading
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center space-x-2">
        {spinner}
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;