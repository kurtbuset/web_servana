import { useMemo } from 'react';

/**
 * usePagination Hook
 * Generates pagination range with ellipsis
 * 
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Number of items per page
 * @param {number} currentPage - Current active page
 * @param {number} siblingCount - Number of pages to show on each side of current page
 * @returns {Object} Pagination data and helpers
 */
export const usePagination = ({
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  siblingCount = 1
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2*DOTS

    // Case 1: If the number of pages is less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, 'DOTS', totalPages];
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);

      return [firstPageIndex, 'DOTS', ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex];
    }
  }, [totalItems, itemsPerPage, currentPage, siblingCount, totalPages]);

  return {
    currentPage,
    totalPages,
    paginationRange,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems)
  };
};

// Helper function to create range array
const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export default usePagination;
