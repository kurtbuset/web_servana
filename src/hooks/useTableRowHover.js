/**
 * useTableRowHover - Returns onMouseEnter/Leave handlers for <tr> elements
 * that apply the standard purple-tinted hover background.
 *
 * @param {boolean} isDark
 * @returns {{ onMouseEnter: Function, onMouseLeave: Function }}
 */
export function useTableRowHover(isDark) {
  return {
    onMouseEnter: (e) => {
      e.currentTarget.style.backgroundColor = isDark
        ? 'rgba(139, 92, 246, 0.05)'
        : 'rgba(249, 250, 251, 1)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    },
  };
}
