import { ChevronLeft, ChevronRight, MoreHorizontal } from 'react-feather';

/**
 * Pagination Component
 * A reusable pagination component for navigating through pages
 * 
 * @example
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} isDark={isDark} />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1} isDark={isDark}>
 *         1
 *       </PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationEllipsis />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext onClick={() => handlePageChange(currentPage + 1)} isDark={isDark} />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 */

const Pagination = ({ className = '', ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={`mx-auto flex w-full justify-center ${className}`}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = ({ className = '', ...props }) => (
  <ul
    className={`flex flex-row items-center gap-1 ${className}`}
    {...props}
  />
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = ({ className = '', ...props }) => (
  <li className={className} {...props} />
);
PaginationItem.displayName = 'PaginationItem';

const PaginationLink = ({
  className = '',
  isActive = false,
  size = 'icon',
  disabled = false,
  isNavButton = false,
  isDark = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-xs md:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const sizeStyles = {
    default: 'h-8 md:h-9 px-2 md:px-4 py-1.5 md:py-2',
    sm: 'h-7 md:h-8 px-2 md:px-3 text-[10px] md:text-xs',
    lg: 'h-9 md:h-10 px-4 md:px-8',
    icon: 'h-8 w-8 md:h-9 md:w-9'
  };

  // Different styles for navigation buttons (Previous/Next) vs page numbers
  const variantStyles = isNavButton
    ? disabled
      ? `bg-transparent ${isDark ? 'text-gray-600' : 'text-gray-400'} cursor-not-allowed opacity-40`
      : `bg-transparent hover:bg-gray-500/30 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`
    : isActive
    ? `border-2 ${isDark ? 'border-[#8B5CF6] bg-[#2a2a2a] text-white hover:bg-[#6237A0]/10' : 'border-[#6237A0] bg-white text-black hover:bg-gray-50'} font-bold`
    : `bg-transparent ${isDark ? 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white border-gray-600' : 'text-black hover:bg-gray-100 hover:text-black border-black'}`;

  return (
    <button
      aria-current={isActive ? 'page' : undefined}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...((!isNavButton && !isActive) && { 
          borderWidth: '0.25px',
          opacity: 0.4
        })
      }}
      {...props}
    />
  );
};
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className = '', disabled = false, isDark = false, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    disabled={disabled}
    isNavButton={true}
    isDark={isDark}
    className={`gap-0.5 md:gap-1 pl-1.5 md:pl-2.5 ${className}`}
    {...props}
  >
    <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
    <span className="text-[10px] md:text-sm">Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className = '', disabled = false, isDark = false, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    disabled={disabled}
    isNavButton={true}
    isDark={isDark}
    className={`gap-0.5 md:gap-1 pr-1.5 md:pr-2.5 ${className}`}
    {...props}
  >
    <span className="text-[10px] md:text-sm">Next</span>
    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className = '', ...props }) => (
  <span
    aria-hidden
    className={`flex h-8 w-8 md:h-9 md:w-9 items-center justify-center ${className}`}
    {...props}
  >
    <MoreHorizontal className="w-3 h-3 md:w-4 md:h-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
