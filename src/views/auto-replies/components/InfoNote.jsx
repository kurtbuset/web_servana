/**
 * InfoNote - Information banner about auto-reply department tagging
 */
export default function InfoNote({ selectedDepartment, isDark }) {
  return (
    <div className="md:flex-[0.6] p-2 rounded flex items-start gap-1.5" style={{ backgroundColor: isDark ? 'rgba(98, 55, 160, 0.1)' : 'rgba(98, 55, 160, 0.05)', border: `1px solid ${isDark ? 'rgba(98, 55, 160, 0.2)' : 'rgba(98, 55, 160, 0.1)'}` }}>
      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#6237A0' }} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div className="flex-1">
        <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
          {selectedDepartment === 'All' 
            ? 'Auto-replies tagged as @everyone can be used across all departments'
            : `Auto-replies tagged for ${selectedDepartment} can only be used within this department`
          }
        </p>
      </div>
    </div>
  );
}
